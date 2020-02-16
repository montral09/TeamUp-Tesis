using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.EntityToVO
{
    public static class PreferentialPlanToVOPreferentialPlanConverter
    {
        public static VOPreferentialPlan Convert(PreferentialPlan pPlan)
        {
            VOPreferentialPlan voPPlan = new VOPreferentialPlan
            {
                IdPlan = pPlan.IdPlan,
                Description = pPlan.Description,
                StateCode = pPlan.StateCode,
                StateDescription = pPlan.StateDescription,
                Price = pPlan.Price,
                PublicationPrice = pPlan.PublicationPrice,
                PaymentDate = pPlan.PaymentDate,
                Comment = pPlan.Comment,
                Evidence = pPlan.Evidence
            };
            return voPPlan;
        }
    }
}
