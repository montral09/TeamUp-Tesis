using Newtonsoft.Json;
using System.Net;
using Microsoft.CSharp;
using RestSharp;

namespace backend.Logic
{
    public class PushNotification
    {
        public void Send(string token, string notificationTitle, string notificationBody)
        {
            var client = new RestClient("https://exp.host");
            var request = new RestRequest("/--/api/v2/push/send", Method.POST);

            request.AddJsonBody(new
            {
                to = token,
                title = notificationTitle,
                body = notificationBody
            });

            IRestResponse response = client.Execute(request);
            var content = response.Content; // {"message":" created."}



            /*dynamic body = new
            {
                to = token,
                title = notificationTitle,
                body = notificationBody,
            }.ToString();
            string request = "to: " + token + "," + "title: " + notificationTitle + ", body: " + notificationBody;

            string response = null;
            
            using (WebClient client = new WebClient())
            {
                client.Headers.Add("accept", "application/json");
                client.Headers.Add("accept-encoding", "gzip, deflate");
                client.Headers.Add("Content-Type", "application/json");
                response = client.UploadString("https://exp.host/--/api/v2/push/send", body);
            }
            //var json = JsonExtensions.SerializeToJson(response);
            return "";*/
        }
    }
}
