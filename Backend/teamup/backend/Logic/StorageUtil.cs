using backend.Data_Access.VO.Data;
using Dropbox.Api;
using Dropbox.Api.Files;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend.Logic
{
    public class StorageUtil
    {
        private static string ApiKey = "AIzaSyD-JbeaI9vpBf-22Dqqvjd9gPZpoyu0Pqs";
        private static string Bucket = "teamup-1571186671227.appspot.com";
        private static string AuthEmail = "teamupude@gmail.com";
        private static string AuthPassword = "teamupudeude";

        public void StoreImage(List<VOImage> filesToUpload, Int64 idUser, int idPublication)
        {
           /* try
            {
                for (int i = 0; i < filesToUpload.Count; i++)
                {
                    byte[] byteArray = Convert.FromBase64String(filesToUpload[i].Base64String);
                    var mem = new MemoryStream(byteArray);
                    var updated = dbx.Files.UploadAsync(
                       (path + "/" + idPublication + "/" + (i+1) + "." + filesToUpload[i].Extension), WriteMode.Overwrite.Instance, body: mem);
                }
            }
            catch (Exception err)
            {

            }*/
        }

        public List<String> GetImagesPublication(Int64 idUser, int idPublication, string images)
        {
            string ROOT = ConfigurationManager.AppSettings["ROOT_DROPBOX"];
            string pathFolder = ROOT + idUser + "/" + idPublication;
            List<String> imagesUrl = new List<String>();
            List<String> imagesList = images.Split(',').ToList();
            string imageURL = "";
            for (int i = 0; i < imagesList.Count; i++) {
                imageURL = pathFolder + "?preview=" + imagesList[i];
                imagesUrl.Add(imageURL);
            }
            return imagesUrl;

        }
    }
}
