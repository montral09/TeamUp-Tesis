using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using backend.Exceptions;
using backend.Logic;
using backend.Logic.Entities;

namespace backend.Data_Access.Query
{
    public class DAOUsers : IDAOUsers
    {
        private QueryDAOUsers cns;
        public DAOUsers()
        {
            cns = new QueryDAOUsers();
        }
        private String GetConnectionString()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            return con;
        }

        /// <summary>
        /// Returns if user exists
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> true if exists </returns>
        public bool Member(String mail)
        {
            SqlConnection con = null;
            bool member = false;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.Member();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    member = true;
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return member;
        }

        /// <summary>
        /// Given an email address returns user info
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> User </returns>
        public Publisher Find(String mail)
        {
            SqlConnection con = null;
            Publisher user = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.User();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    user = new Publisher(Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), 
                        Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["active"]), Convert.ToString(dr["description"]),
                        Convert.ToInt32(dr["idLanguage"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), 
                        Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]));
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return user;
        }

        /// <summary>
        /// Insert user info into database, creates an encrytped password and returns activation code to send via email
        /// </summary>
        /// <param name="user"></param>
        /// <returns> Activation code </returns>
        public string InsertUser(Customer user)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;                   
            try
            {
                // Create secure password
                PasswordHasher passwordHasher = new PasswordHasher();
                string hashPassword = passwordHasher.HashPassword(user.Password);                
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                int language = GetIdLanguageByDescription(user.LanguageDescription);
                string activationCode = Guid.NewGuid().ToString();
                String query = cns.InsertUser();
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                    {
                        new SqlParameter("@mail", SqlDbType.VarChar) {Value = user.Mail},
                        new SqlParameter("@name", SqlDbType.VarChar) {Value = user.Name},
                        new SqlParameter("@lastName", SqlDbType.VarChar) {Value = user.LastName},
                        new SqlParameter("@password", SqlDbType.VarChar) {Value = hashPassword},
                        new SqlParameter("@phone", SqlDbType.VarChar) {Value = user.Phone},
                        new SqlParameter("@checkPublisher", SqlDbType.Bit) {Value = user.CheckPublisher},
                        new SqlParameter("@rut", SqlDbType.VarChar) {Value = user.Rut},
                        new SqlParameter("@razonSocial", SqlDbType.VarChar) {Value = user.RazonSocial},
                        new SqlParameter("@address", SqlDbType.VarChar) { Value = user.Address},
                        new SqlParameter("@language", SqlDbType.Int) { Value = language},
                        new SqlParameter("@activationCode", SqlDbType.VarChar) {Value = activationCode},
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.Transaction = objTrans;
                insertCommand.ExecuteNonQuery();
                objTrans.Commit();
                return activationCode;
            }
            catch (Exception e)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());                                             
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }                              
            }
        }

        /// <summary>
        /// Updates user info, updates encrypted password and returns activation code to send via email
        /// </summary>
        /// <param name="user"></param>
        /// <param name="newMail"></param>
        /// <returns> Activation code</returns>
        public string UpdateUser(Customer user, String newMail)
        {
            SqlConnection con = null;
            string activationCode = "";
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (!user.Mail.Equals(newMail))
                {
                    activationCode = Guid.NewGuid().ToString();
                    string queryInvalidateMail = cns.InvalidateMail();
                    SqlCommand invalidateMailCommand = new SqlCommand(queryInvalidateMail, con);
                    List<SqlParameter> parameterInvalidate = new List<SqlParameter>()
                    {
                        new SqlParameter("@mail", SqlDbType.VarChar) {Value =  user.Mail},
                        new SqlParameter("@activationCode", SqlDbType.VarChar) {Value = activationCode},
                    };
  
                    invalidateMailCommand.Parameters.AddRange(parameterInvalidate.ToArray());
                    invalidateMailCommand.ExecuteNonQuery();                    
                }
                if (user.Password != "")
                {
                    String queryPassword = cns.UpdatePassword();
                    // Create secure password
                    PasswordHasher passwordHasher = new PasswordHasher();
                    string hashPassword = passwordHasher.HashPassword(user.Password);
                    SqlCommand updatePassword = new SqlCommand(queryPassword, con);
                    List<SqlParameter> parameterPassword = new List<SqlParameter>()
                    {
                        new SqlParameter("@password", SqlDbType.VarChar) {Value = hashPassword},
                        new SqlParameter("@mail", SqlDbType.VarChar) {Value = user.Mail},
                    };
                    updatePassword.Parameters.AddRange(parameterPassword.ToArray());
                    updatePassword.ExecuteNonQuery();
                }
                int? idUser = null;
                String queryGetID = cns.Member();
                SqlCommand selectCommand = new SqlCommand(queryGetID, con);
                SqlParameter parametroID = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = user.Mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametroID);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    idUser = Convert.ToInt32(dr["idUser"]);
                }
                dr.Close();
                int language = GetIdLanguageByDescription(user.LanguageDescription);
                String query = cns.UpdateUser();
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                 {
                    new SqlParameter("@idUser", SqlDbType.Int) { Value = idUser},
                    new SqlParameter("@mail", SqlDbType.VarChar) {Value = newMail},
                    new SqlParameter("@name", SqlDbType.VarChar) {Value = user.Name},
                    new SqlParameter("@lastName", SqlDbType.VarChar) {Value = user.LastName},
                    new SqlParameter("@phone", SqlDbType.VarChar) {Value = user.Phone},
                    new SqlParameter("@rut", SqlDbType.VarChar) {Value = user.Rut},
                    new SqlParameter("@razonSocial", SqlDbType.VarChar) {Value = user.RazonSocial},
                    new SqlParameter("@address", SqlDbType.VarChar) { Value = user.Address},
                    new SqlParameter("@language", SqlDbType.Int) { Value = language},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
                return activationCode;
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Deactivates user by updating state
        /// </summary>
        /// <param name="mail"></param>
        public void DeleteUser(String mail)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.DeleteUser();
                SqlCommand deleteCommand = new SqlCommand(query, con);
                SqlParameter parametroMail = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                deleteCommand.Parameters.Add(parametroMail);
                deleteCommand.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Before deleting an user, it is neccesary to check for pendings process.
        /// (reservations, payments)
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> Error or success message </returns>
        public String ValidateDeletion(String mail)
        {
            SqlConnection con = null;
            bool isPublisher = IsPublisher(mail);
            User user = Find(mail);
            String result = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query;
                //1: Check for pending reservations
                query = cns.CheckPendingReservation();
                SqlCommand pendingReservationCommand = new SqlCommand(query, con);
                SqlParameter pendingReservationParam = new SqlParameter()
                {
                    ParameterName = "@idCustomer",
                    Value = user.IdUser,
                    SqlDbType = SqlDbType.Int
                };
                pendingReservationCommand.Parameters.Add(pendingReservationParam);
                SqlDataReader dr;
                dr = pendingReservationCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    result = EnumMessages.ERR_PENDINGRESERVATIONCUSTOMER.ToString();
                }
                else
                {
                    //2: Check for pending reservations payments
                    query = cns.CheckPendingReservationPayment();
                    SqlCommand pendingReservationPaymentCommand = new SqlCommand(query, con);
                    SqlParameter pendingReservationPaymentParam = new SqlParameter()
                    {
                        ParameterName = "@idCustomer",
                        Value = user.IdUser,
                        SqlDbType = SqlDbType.Int
                    };
                    pendingReservationPaymentCommand.Parameters.Add(pendingReservationPaymentParam);
                    dr = pendingReservationPaymentCommand.ExecuteReader();
                    if (dr.HasRows)
                    {
                        result = EnumMessages.ERR_PENDINGRESERVATIONPAYMENT.ToString();
                    }
                    else
                    {
                        // 3: If user is publisher 
                        if (isPublisher)
                        {
                            //3.1 check for pending publications
                            query = cns.CheckPendingPublications();
                            SqlCommand pendingPublicationCommand = new SqlCommand(query, con);
                            SqlParameter pendingPublicationParam = new SqlParameter()
                            {
                                ParameterName = "@idUser",
                                Value = user.IdUser,
                                SqlDbType = SqlDbType.Int
                            };
                            pendingPublicationCommand.Parameters.Add(pendingPublicationParam);
                            dr = pendingPublicationCommand.ExecuteReader();
                            if (dr.HasRows)
                            {
                                result = EnumMessages.ERR_PENDINGPUBLICATION.ToString();
                            }
                            else
                            {
                                // 3.2 check for pending reservations of one of publisher's publication
                                query = cns.CheckPendingReservationPublisher();
                                SqlCommand pendingReservationPublisherCommand = new SqlCommand(query, con);
                                SqlParameter pendingReservationPublisherParam = new SqlParameter()
                                {
                                    ParameterName = "@idUser",
                                    Value = user.IdUser,
                                    SqlDbType = SqlDbType.Int
                                };
                                pendingReservationPublisherCommand.Parameters.Add(pendingReservationPublisherParam);
                                dr = pendingReservationPublisherCommand.ExecuteReader();
                                if (dr.HasRows)
                                {
                                    result = EnumMessages.ERR_PENDINGRESERVATIONPUBLISHER.ToString();
                                }
                                else
                                {
                                    // 3.3 check for pending preferential payment
                                    query = cns.CheckPendingPreferentialPayment();
                                    SqlCommand pendingPreferntialPaymentCommand = new SqlCommand(query, con);
                                    SqlParameter pendingPreferntialPaymentParam = new SqlParameter()
                                    {
                                        ParameterName = "@idUser",
                                        Value = user.IdUser,
                                        SqlDbType = SqlDbType.Int
                                    };
                                    pendingPreferntialPaymentCommand.Parameters.Add(pendingPreferntialPaymentParam);
                                    dr = pendingPreferntialPaymentCommand.ExecuteReader();
                                    if (dr.HasRows)
                                    {
                                        result = EnumMessages.ERR_PENDINGPREFERENTIALPAYMENT.ToString();
                                    }
                                    else
                                    {
                                        // 3.4 check for pending commission payment
                                        query = cns.CheckPendingCommissionPayment();
                                        SqlCommand pendingCommissionPaymentCommand = new SqlCommand(query, con);
                                        SqlParameter pendingCommissionPaymentParam = new SqlParameter()
                                        {
                                            ParameterName = "@idUser",
                                            Value = user.IdUser,
                                            SqlDbType = SqlDbType.Int
                                        };
                                        pendingCommissionPaymentCommand.Parameters.Add(pendingCommissionPaymentParam);
                                        dr = pendingCommissionPaymentCommand.ExecuteReader();
                                        if (dr.HasRows)
                                        {
                                            result = EnumMessages.ERR_PENDINGCOMMISSIONPAYMENT.ToString();
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
                dr.Close();
            } catch (Exception e)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return result;
        }

        /// <summary>
        /// Returns all publishers who hasn´t been approved yet
        /// </summary>
        /// <returns> Users </returns>
        public List<Publisher> GetPublishers()
        {
            SqlConnection con = null;
            List<Publisher> publishers = new List<Publisher>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublishers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                Publisher publisher;
                while (dr.Read())
                {                                      
                    publisher = new Publisher(0, Convert.ToString(dr["mail"]), "", Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]),
                        Convert.ToString(dr["phone"]), true, null, 0, true, Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), 
                        Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]));
                    publishers.Add(publisher);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return publishers;
        }

        /// <summary>
        /// Approves all publishers by changing publicherValidated value
        /// </summary>
        /// <param name="mails"></param>
        public void ApprovePublishers(List<String> mails)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.ApprovePublishers();
                for (int i = 0; i < mails.Count; i++)
                {
                    SqlCommand updateCommand = new SqlCommand(query, con);
                    SqlParameter parametroMails = new SqlParameter()
                    {
                        ParameterName = "@publisherMail",
                        Value = mails[i],
                        SqlDbType = SqlDbType.VarChar
                    };

                    updateCommand.Parameters.Add(parametroMails);
                    updateCommand.ExecuteNonQuery();
                }
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Returns admin info by entering mail and password
        /// </summary>
        /// <param name="mail"></param>
        /// <param name="password"></param>
        /// <returns> Admin</returns>
        public Admin GetAdmin(String mail, String password)
        {
            SqlConnection con = null;
            Admin admin = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetAdmin();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    admin = new Admin(0, Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), 
                        Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), 
                        true, null, 0);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return admin;
        }

        /// <summary>
        /// Returns if mail has been already validated
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> true if is validated </returns>
        public bool IsMailValidated(String mail)
        {
            SqlConnection con = null;
            bool mailValidated = false;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.UserValidated();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    mailValidated = true;
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return mailValidated;
        }

        /// <summary>
        /// Updates checkPublisher = true to given mail
        /// </summary>
        /// <param name="mail"></param>
        public void RequestPublisher(String mail)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.RequestPublisher();

                SqlCommand updateCommand = new SqlCommand(query, con);
                SqlParameter parametroMail = new SqlParameter()
                {
                    ParameterName = "@customerMail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };

                updateCommand.Parameters.Add(parametroMail);
                updateCommand.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// For a certain email creates access and refresh tokens with their expiration dates
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> Tokens </returns>
        public Tokens CreateTokens(String mail)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.CreateTokens();
                // Create access token and access token expiration
                string accessToken = Util.GetRandomString();
                var accessMinutesExpiration = ConfigurationManager.AppSettings["JWT_EXPIRE_MINUTES"];
                DateTime accessTokenExpiration = DateTime.UtcNow.AddMinutes(Convert.ToInt32(accessMinutesExpiration));
                // Create refresh token and refresh token expiration
                string refreshToken = Util.GetRandomString();
                var refreshDaysExpiration = ConfigurationManager.AppSettings["JWT_REFRESH_EXPIRE_DAYS"];
                DateTime refreshTokenExpiration = DateTime.UtcNow.AddDays(Convert.ToInt32(refreshDaysExpiration));
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                 {
                    new SqlParameter("@accessToken", SqlDbType.VarChar) {Value = accessToken},
                    new SqlParameter("@accessTokenExpiration", SqlDbType.SmallDateTime) {Value = accessTokenExpiration},
                    new SqlParameter("@refreshToken", SqlDbType.VarChar) {Value = refreshToken},
                    new SqlParameter("@refreshTokenExpiration", SqlDbType.SmallDateTime) {Value = refreshTokenExpiration},
                    new SqlParameter("@mail", SqlDbType.VarChar) {Value = mail},
                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
                return new Tokens(accessToken, refreshToken);
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        
        /// <summary>
        /// Creates a random password to given mail and sends it to user
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> Random password </returns>
        public string UpdatePassword(String mail)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            string randomPassword = "";
            Util util = new Util();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                User user = Find(mail);
                string queryPassword = cns.UpdatePassword();
                // Generate random password
                randomPassword = Path.GetRandomFileName().Replace(".", "").Substring(0, 8);
                // Encrypted password
                PasswordHasher passwordHasher = new PasswordHasher();
                string hashPassword = passwordHasher.HashPassword(randomPassword);
                SqlCommand updatePassword = new SqlCommand(queryPassword, con);
                List<SqlParameter> parameterPassword = new List<SqlParameter>()
                {
                    new SqlParameter("@password", SqlDbType.VarChar) {Value = hashPassword},
                    new SqlParameter("@mail", SqlDbType.VarChar) {Value = mail},
                };
                updatePassword.Parameters.AddRange(parameterPassword.ToArray());
                updatePassword.Transaction = objTrans;
                updatePassword.ExecuteNonQuery();
                objTrans.Commit();
                return randomPassword;
            }
            catch (Exception)
            {
                if (objTrans != null && objTrans.Connection != null)
                {
                    objTrans.Rollback();
                    objTrans.Dispose();
                }
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Updates mailValidated given an activation code
        /// </summary>
        /// <param name="activationCode"></param>
        /// <returns> number of records updated (to check if any record has been updated)</returns>
        public int ValidateEmail(String activationCode)
        {
            SqlConnection con = null;
            Util util = new Util();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                string query = cns.ValidateEmail();
                SqlCommand updateCommand = new SqlCommand(query, con);
                SqlParameter parameterActivationCode = new SqlParameter()
                {
                    ParameterName = "@activationCode",
                    Value = activationCode,
                    SqlDbType = SqlDbType.VarChar

                };
                updateCommand.Parameters.Add(parameterActivationCode);
                int numberOfRecords = updateCommand.ExecuteNonQuery();
                return numberOfRecords;
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Updates user info (called by an admin user)
        /// </summary>
        /// <param name="mail"></param>
        /// <param name="name"></param>
        /// <param name="lastName"></param>
        /// <param name="phone"></param>
        /// <param name="checkPublisher"></param>
        /// <param name="rut"></param>
        /// <param name="razonSocial"></param>
        /// <param name="address"></param>
        /// <param name="mailValidated"></param>
        /// <param name="publisherValidated"></param>
        /// <param name="active"></param>
        public void UpdateUserAdmin(string mail, string name,string lastName, string phone, bool checkPublisher,
                        string rut, string razonSocial, string address, bool mailValidated,bool publisherValidated, bool active)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                int? idUser = null;
                String queryGetID = cns.Member();
                SqlCommand selectCommand = new SqlCommand(queryGetID, con);
                SqlParameter parametroID = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametroID);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    idUser = Convert.ToInt32(dr["idUser"]);
                }
                dr.Close();
                String query = cns.UpdateUserAdmin();
                SqlCommand updateCommand = new SqlCommand(query, con);
                List<SqlParameter> prm = new List<SqlParameter>()
                 {
                    new SqlParameter("@idUser", SqlDbType.Int) { Value = idUser},
                    new SqlParameter("@mail", SqlDbType.VarChar) {Value = mail},
                    new SqlParameter("@name", SqlDbType.VarChar) {Value = name},
                    new SqlParameter("@lastName", SqlDbType.VarChar) {Value = lastName},
                    new SqlParameter("@phone", SqlDbType.VarChar) {Value = phone},
                    new SqlParameter("@checkPublisher", SqlDbType.Bit) {Value = checkPublisher},
                    new SqlParameter("@rut", SqlDbType.VarChar) {Value = rut},
                    new SqlParameter("@razonSocial", SqlDbType.VarChar) {Value = razonSocial},
                    new SqlParameter("@address", SqlDbType.VarChar) { Value = address},
                    new SqlParameter("@mailValidated", SqlDbType.Bit) { Value = mailValidated},
                    new SqlParameter("@publisherValidated", SqlDbType.Bit) { Value = publisherValidated},
                    new SqlParameter("@active", SqlDbType.Bit) { Value = active},

                };
                updateCommand.Parameters.AddRange(prm.ToArray());
                updateCommand.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        /// <summary>
        /// Returns all users
        /// </summary>
        /// <returns> Users </returns>
        public List<Publisher> GetUsers()
        {
            SqlConnection con = null;
            List<Publisher> users = new List<Publisher>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetUsers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                Publisher user;
                while (dr.Read())
                {
                    user = new Publisher(0, Convert.ToString(dr["mail"]), null, Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]),
                        Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["active"]), null, 0, Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), 
                        Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), 
                        Convert.ToBoolean(dr["publisherValidated"]));                   
                    users.Add(user);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return users;
        }

        /// <summary>
        /// Check if email belongs to an admin user
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> true if is admin </returns>
        public bool AdminMember(String mail)
        {
            SqlConnection con = null;
            bool member = false;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.AdminMember();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    member = true;
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return member;
        }

        /// <summary>
        /// Given an access token return user info 
        /// </summary>
        /// <param name="accessToken"></param>
        /// <returns> User </returns>
        public Publisher GetUserData(string accessToken)
        {
            SqlConnection con = null;
            Publisher user = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetUserData();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parameter = new SqlParameter()
                {
                    ParameterName = "@accessToken",
                    Value = accessToken,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parameter);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    user = new Publisher(Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), "",
                        Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), 
                        Convert.ToBoolean(dr["active"]), null, 0, Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), 
                        Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]));
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return user;
        }

        /// <summary>
        /// Returns if email belongs to a publisher user
        /// </summary>
        /// <param name="mail"></param>
        /// <returns> true if email belongs to a publisher user</returns>
        public bool IsPublisher(String mail)
        {
            SqlConnection con = null;
            bool member = false;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.IsPublisher();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parametro = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parametro);
                SqlDataReader dr = selectCommand.ExecuteReader();
                if (dr.HasRows)
                {
                    member = true;
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return member;
        }

        /// <summary>
        /// Given the description of a language, returns its id
        /// </summary>
        /// <param name="descLanguage"></param>
        /// <returns> Language id</returns>
        public int GetIdLanguageByDescription(String descLanguage)
        {
            int id = 0;
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetIdLanguageByDescription();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@description",
                    Value = descLanguage,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    id = Convert.ToInt32(dr["idLanguage"]);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return id;
        }

        /// <summary>
        /// Inserts into user the device token seny by user when logins from mobile device
        /// </summary>
        /// <param name="mail"></param>
        /// <param name="deviceToken"></param>
        public void InsertDeviceToken(string mail, string deviceToken)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.InsertDeviceToken();
                SqlCommand insertCommand = new SqlCommand(query, con);
                List<SqlParameter> param = new List<SqlParameter>()
                {
                    new SqlParameter("@deviceToken", SqlDbType.VarChar) {Value = deviceToken},
                    new SqlParameter("@mail", SqlDbType.VarChar) {Value = mail},
                };
                insertCommand.Parameters.AddRange(param.ToArray());
                insertCommand.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public String GetDeviceToken(string mail)
        {
            string deviceToken = null;
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetDeviceToken();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter param = new SqlParameter()
                {
                    ParameterName = "@mail",
                    Value = mail,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(param);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    deviceToken = Convert.ToString(dr["deviceToken"]);
                }
                dr.Close();
            }
            catch (Exception)
            {
                throw new GeneralException(EnumMessages.ERR_SYSTEM.ToString());
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return deviceToken;
        }
    }
}
