//using System.Web.Http;
using System;
using System.Configuration;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using backend.Logic;
using Hangfire;

namespace webapi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        IFacadeWeb fach = new FacadeFactory().CreateFacadeWeb;
        private BackgroundJobServer _backgroundJobServer;
        protected void Application_Start()
        {
            String con = ConfigurationManager.ConnectionStrings["ConnectionString"].ToString();
            string fireTimeFinishPublication = ConfigurationManager.AppSettings["FIRETIME_FINISH_PUBLICATIONS"];
            string fireTimeFinishReservations = ConfigurationManager.AppSettings["FIRETIME_FINISH_RESERVATIONS"];
            string fireTimeInProgressReservations = ConfigurationManager.AppSettings["FIRETIME_INPROGRESS_RESERVATIONS"];            
            System.Web.Http.GlobalConfiguration.Configure(WebApiConfig.Register);
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configuration.UseSqlServerStorage(con);
            _backgroundJobServer = new BackgroundJobServer();
            RecurringJob.AddOrUpdate(() => fach.FinishPublications(), fireTimeFinishPublication, TimeZoneInfo.Local);
            RecurringJob.AddOrUpdate(() => fach.FinishReservations(), fireTimeFinishReservations, TimeZoneInfo.Local);
            RecurringJob.AddOrUpdate(() => fach.StartReservation(), fireTimeInProgressReservations, TimeZoneInfo.Local);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);            
        }
    }
}
