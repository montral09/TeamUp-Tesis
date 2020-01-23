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
            string fireTimePublication = ConfigurationManager.AppSettings["FIRETIME_PUBLICATIONS"];
            string fireTimeReservations = ConfigurationManager.AppSettings["FIRETIME_RESERVATIONS"];
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configuration.UseSqlServerStorage(con);
            _backgroundJobServer = new BackgroundJobServer();
            RecurringJob.AddOrUpdate(() => fach.FinishPublications(), fireTimePublication);
            RecurringJob.AddOrUpdate(() => fach.FinishReservations(), fireTimeReservations);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
