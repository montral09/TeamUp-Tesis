using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;
using backend.Data_Access.VO;
using backend.Data_Access.VO.Data;
using backend.Exceptions;
using backend.Logic;
using webapi.Controllers;

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

        public User Find(String mail)
        {
            SqlConnection con = null;
            User user = null;
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
                    user = new User(Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]), Convert.ToBoolean(dr["active"]));
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

        public async Task InsertUser(User user)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            const string URL = "http://localhost:3000/account/validateemail/";
            try
            {

                // Create secure password
                PasswordHasher passwordHasher = new PasswordHasher();
                string hashPassword = passwordHasher.HashPassword(user.Password);
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
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
                    };
                insertCommand.Parameters.AddRange(prm.ToArray());
                insertCommand.Transaction = objTrans;
                insertCommand.ExecuteNonQuery();
                // Generate activation code
                String queryActivation = cns.InsertActivationCode();
                string activationCode = Guid.NewGuid().ToString();
                SqlCommand updateCommand = new SqlCommand(queryActivation, con);
                List<SqlParameter> parameters = new List<SqlParameter>()
                    {
                        new SqlParameter("@activationCode", SqlDbType.VarChar) {Value = activationCode},
                        new SqlParameter("@mail", SqlDbType.VarChar) {Value = user.Mail},
                    };
                updateCommand.Parameters.AddRange(parameters.ToArray());
                updateCommand.Transaction = objTrans;
                updateCommand.ExecuteNonQuery();
                // Generate body
                string subject = "Account Activation";
                string body = "Hello " + user.Name + ",";
                body += "<br /><br />Please click the following link to activate your account";
                string activationLink = URL + activationCode;
                body += "<br /><a href = '" + activationLink + "'>Click here to activate your account.</a>";
                body += "<br /><br />Thanks";
                Util util = new Util();
                util.SendEmailAsync(user.Mail, body, subject);
                objTrans.Commit();
            }
            catch (Exception)
            {
                objTrans.Rollback();
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

        public async Task UpdateUser(User user, String newMail)
        {
            SqlConnection con = null;
            try
            {
                const string URL = "http://localhost:3000/account/validateemail/";
                con = new SqlConnection(GetConnectionString());
                con.Open();
                if (!user.Mail.Equals(newMail))
                {
                    string activationCode = Guid.NewGuid().ToString();
                    string queryInvalidateMail = cns.InvalidateMail();
                    SqlCommand invalidateMailCommand = new SqlCommand(queryInvalidateMail, con);
                    List<SqlParameter> parameterInvalidate = new List<SqlParameter>()
                    {
                        new SqlParameter("@mail", SqlDbType.VarChar) {Value =  user.Mail},
                        new SqlParameter("@activationCode", SqlDbType.VarChar) {Value = activationCode},
                    };
  
                    invalidateMailCommand.Parameters.AddRange(parameterInvalidate.ToArray());
                    invalidateMailCommand.ExecuteNonQuery();
                    string subject = "Account Activation";
                    string body = "Hello " + user.Name + ",";
                    body += "<br /><br />Please click the following link to activate your account";
                    string activationLink = URL + activationCode;
                    body += "<br /><a href = '" + activationLink + "'>Click here to activate your account.</a>";
                    body += "<br /><br />Thanks";
                    Util util = new Util();
                    util.SendEmailAsync(newMail, body, subject);
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
        /* Before delete an user, check if its possible by:
         * 1 - Checking active publications
         * 2 - Checking pending payments
         */
        public bool ValidateDeletion(String mail)
        {
            //TODO
            return true;

        }

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

        public List<VOPublisher> GetPublishers()
        {
            SqlConnection con = null;
            List<VOPublisher> publishers = new List<VOPublisher>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetPublishers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    VOPublisher vo = new VOPublisher(Convert.ToString(dr["mail"]), "", Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["publisherValidated"]), Convert.ToBoolean(dr["mailValidated"]));
                    publishers.Add(vo);
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

        public List<VOCustomer> GetCustomers()
        {
            SqlConnection con = null;
            List<VOCustomer> customers = new List<VOCustomer>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetCustomers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    VOCustomer vo = new VOCustomer(Convert.ToString(dr["mail"]), "", Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]));
                    customers.Add(vo);
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
            return customers;
        }

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
                    admin = new Admin(Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]));
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

        public VOTokens CreateTokens(String mail)
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
                return new VOTokens(accessToken, refreshToken);
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

        public bool ValidAccessToken(String mail, String accessToken)
        {
            //TODO
            return true;
        }

        public async Task UpdatePassword(String mail)
        {
            SqlConnection con = null;
            SqlTransaction objTrans = null;
            const string URL = "http://localhost:3000/account/login/";
            Util util = new Util();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                objTrans = con.BeginTransaction();
                User user = Find(mail);
                string queryPassword = cns.UpdatePassword();
                // Generate random password
                string randomPassword = Path.GetRandomFileName().Replace(".", "").Substring(0, 8);
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

                // Generate body
                string subject = "Your password was reset";
                string body = "Hello " + user.Name + ",";
                body += "<br /><br />Your account has been updated and a new random password has been generated. Your new password is " + randomPassword;
                body += "<br /><br />We strongly recommend to change it";
                string activationLink = URL;
                body += "<br /><a href = '" + activationLink + "'>You can log in from here.</a>";
                body += "<br /><br />Thanks";
                util.SendEmailAsync(mail, body, subject);
                objTrans.Commit();
            }
            catch (Exception)
            {
                objTrans.Rollback();
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

        public void UpdateUserAdmin(VORequestUpdateUserAdmin voRequest)
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
                    Value = voRequest.Mail,
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
                    new SqlParameter("@mail", SqlDbType.VarChar) {Value = voRequest.Mail},
                    new SqlParameter("@name", SqlDbType.VarChar) {Value = voRequest.Name},
                    new SqlParameter("@lastName", SqlDbType.VarChar) {Value = voRequest.LastName},
                    new SqlParameter("@phone", SqlDbType.VarChar) {Value = voRequest.Phone},
                    new SqlParameter("@checkPublisher", SqlDbType.Bit) {Value = voRequest.CheckPublisher},
                    new SqlParameter("@rut", SqlDbType.VarChar) {Value = voRequest.Rut},
                    new SqlParameter("@razonSocial", SqlDbType.VarChar) {Value = voRequest.RazonSocial},
                    new SqlParameter("@address", SqlDbType.VarChar) { Value = voRequest.Address},
                    new SqlParameter("@mailValidated", SqlDbType.Bit) { Value = voRequest.MailValidated},
                    new SqlParameter("@publisherValidated", SqlDbType.Bit) { Value = voRequest.PublisherValidated},
                    new SqlParameter("@active", SqlDbType.Bit) { Value = voRequest.Active},

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

        public List<VOUserAdmin> GetUsers()
        {
            SqlConnection con = null;
            List<VOUserAdmin> users = new List<VOUserAdmin>();
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetUsers();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    VOUserAdmin vo = new VOUserAdmin(Convert.ToString(dr["mail"]), "", Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]), Convert.ToBoolean(dr["active"]));
                    users.Add(vo);
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

        public User GetUserData(VORequestGetUserData voRequestUserData)
        {
            SqlConnection con = null;
            User user = null;
            try
            {
                con = new SqlConnection(GetConnectionString());
                con.Open();
                String query = cns.GetUserData();
                SqlCommand selectCommand = new SqlCommand(query, con);
                SqlParameter parameter = new SqlParameter()
                {
                    ParameterName = "@accessToken",
                    Value = voRequestUserData.AccessToken,
                    SqlDbType = SqlDbType.VarChar
                };
                selectCommand.Parameters.Add(parameter);
                SqlDataReader dr = selectCommand.ExecuteReader();
                while (dr.Read())
                {
                    user = new User(Convert.ToInt64(dr["idUser"]), Convert.ToString(dr["mail"]), Convert.ToString(dr["password"]), Convert.ToString(dr["name"]), Convert.ToString(dr["lastName"]), Convert.ToString(dr["phone"]), Convert.ToBoolean(dr["checkPublisher"]), Convert.ToString(dr["rut"]), Convert.ToString(dr["razonSocial"]), Convert.ToString(dr["address"]), Convert.ToBoolean(dr["mailValidated"]), Convert.ToBoolean(dr["publisherValidated"]), Convert.ToBoolean(dr["active"]));
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

    }
}
