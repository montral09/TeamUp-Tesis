using backend.Data_Access.VO.Data;
using Firebase.Storage;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Firebase.Auth;
using System.Text;

namespace backend.Logic
{
    public class StorageUtil
    {
        private static string ApiKey = ConfigurationManager.AppSettings["API_KEY"];
        private static string Bucket = ConfigurationManager.AppSettings["BUCKET"];                    
        private static string AuthEmail = ConfigurationManager.AppSettings["AUTH_EMAIL"];
        private static string AuthPassword = ConfigurationManager.AppSettings["AUTH_PASSWORD"];

        public StorageUtil() { }

        public async Task<List<string>> StoreImageAsync(List<VOImage> images, Int64 idUser, int idPublication)
        {
            List<string> urls = new List<string>();
            try
            {
                var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);
                MemoryStream ms;
                StringBuilder fullPath = new StringBuilder();
                string fileName;
                for (int i = 0; i < images.Count; i++)
                {
                    fileName = Util.GetRandomString();
                    byte[] byteArray = Convert.FromBase64String(images[i].Base64String);
                    ms = new MemoryStream(byteArray);
                    fullPath = fullPath.Append("Images/").Append(idUser).Append("/").Append(idPublication).Append("/").Append(fileName).Append(".").Append(images[i].Extension);
                    var cancellation = new CancellationTokenSource();
                    var task = new FirebaseStorage(Bucket, new FirebaseStorageOptions
                    {
                        AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                        ThrowOnCancel = true // when you cancel the upload, exception is thrown. By default no exception is thrown
                    });
                    var e = await Task.Factory.StartNew(async () => await task.Child(fullPath.ToString()).PutAsync(ms, cancellation.Token));
                    e.Wait();
                    var u = await task.Child(fullPath.ToString()).GetDownloadUrlAsync();
                    fullPath.Clear();
                    urls.Add(u);
                }
            }
            
            catch (Exception err)
            {
                throw err;
            }
            return urls;
        }

        public static string CreateImagesURLString(List<string> imagesURL)
        {
            return String.Join("','", imagesURL);
        }

        public async Task<string> StoreEvidencePaymentPlanAsync(VOImage image, int idPrefPayment, int idPublication)
        {
            try
            {
                var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);
                MemoryStream ms;
                StringBuilder fullPath = new StringBuilder();
                string fileName;

                    fileName = Util.GetRandomString();
                    byte[] byteArray = Convert.FromBase64String(image.Base64String);
                    ms = new MemoryStream(byteArray);
                    fullPath = fullPath.Append("Payments/Plan").Append("/").Append(idPrefPayment).Append("/").Append(fileName).Append(".").Append(image.Extension);
                    var cancellation = new CancellationTokenSource();
                    var task = new FirebaseStorage(Bucket, new FirebaseStorageOptions
                    {
                        AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                        ThrowOnCancel = true // when you cancel the upload, exception is thrown. By default no exception is thrown
                    });
                    var e = await Task.Factory.StartNew(async () => await task.Child(fullPath.ToString()).PutAsync(ms, cancellation.Token));
                    e.Wait();
                    var u = await task.Child(fullPath.ToString()).GetDownloadUrlAsync();
                    fullPath.Clear();
                    return u;
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task<string> StoreEvidencePaymentReservationCustomerAsync(VOImage image, long idUser, int idReservation)
        {
            try
            {
                var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);
                MemoryStream ms;
                StringBuilder fullPath = new StringBuilder();
                string fileName;

                fileName = Util.GetRandomString();
                byte[] byteArray = Convert.FromBase64String(image.Base64String);
                ms = new MemoryStream(byteArray);
                fullPath = fullPath.Append("Payments/Reservations/").Append(idReservation).Append("/Customer/").Append(idUser).Append(fileName).Append(".").Append(image.Extension);
                var cancellation = new CancellationTokenSource();
                var task = new FirebaseStorage(Bucket, new FirebaseStorageOptions
                {
                    AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                    ThrowOnCancel = true // when you cancel the upload, exception is thrown. By default no exception is thrown
                });
                var e = await Task.Factory.StartNew(async () => await task.Child(fullPath.ToString()).PutAsync(ms, cancellation.Token));
                e.Wait();
                var u = await task.Child(fullPath.ToString()).GetDownloadUrlAsync();
                fullPath.Clear();
                return u;
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task<string> StoreEvidencePaymentReservationPublisherAsync(VOImage image, long idUser, int idReservation)
        {
            try
            {
                var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);
                MemoryStream ms;
                StringBuilder fullPath = new StringBuilder();
                string fileName;

                fileName = Util.GetRandomString();
                byte[] byteArray = Convert.FromBase64String(image.Base64String);
                ms = new MemoryStream(byteArray);
                fullPath = fullPath.Append("Payments/Reservations/").Append(idReservation).Append("/Publisher/").Append(idUser).Append(fileName).Append(".").Append(image.Extension);
                var cancellation = new CancellationTokenSource();
                var task = new FirebaseStorage(Bucket, new FirebaseStorageOptions
                {
                    AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                    ThrowOnCancel = true // when you cancel the upload, exception is thrown. By default no exception is thrown
                });
                var e = await Task.Factory.StartNew(async () => await task.Child(fullPath.ToString()).PutAsync(ms, cancellation.Token));
                e.Wait();
                var u = await task.Child(fullPath.ToString()).GetDownloadUrlAsync();
                fullPath.Clear();
                return u;
            }
            catch (Exception err)
            {
                throw err;
            }
        }
    }
}
