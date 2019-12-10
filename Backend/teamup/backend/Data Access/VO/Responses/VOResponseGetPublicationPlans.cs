using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Responses
{
    public class VOResponseGetPublicationPlans : VOResponse
    {
        public List<VOPublicationPlan> Plans;

        public VOResponseGetPublicationPlans() { }
        public VOResponseGetPublicationPlans(List<VOPublicationPlan> plans)
        {
            Plans = plans;
        }
    }
}
