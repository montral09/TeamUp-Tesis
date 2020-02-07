using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class PublicationPlanToVOPublicationPlanConverter
    {
        public static VOPublicationPlan Convert(PublicationPlan pPlan)
        {
            VOPublicationPlan voPPlan = new VOPublicationPlan
            {
                IdPlan = pPlan.IdPlan,
                Name = pPlan.Name,
                Price = pPlan.Price,
                Days = pPlan.Days
            };
            return voPPlan;
        }

        public static List<VOPublicationPlan> Convert(List<PublicationPlan> pPlans)
        {
            List<VOPublicationPlan> voPlans = new List<VOPublicationPlan>();
            foreach (var pPlan in pPlans)
            {
                voPlans.Add(Convert(pPlan));
            }
            return voPlans;
        }
    }
}
