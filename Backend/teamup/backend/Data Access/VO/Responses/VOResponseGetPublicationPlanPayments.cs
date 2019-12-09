using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Responses
{
    public class VOResponseGetPublicationPlanPayments : VOResponse
    {
        public List<VOPublicationPaymentAdmin> Payments;

        public VOResponseGetPublicationPlanPayments() { }

        public VOResponseGetPublicationPlanPayments(List<VOPublicationPaymentAdmin> payments)
        {
            Payments = payments;
        }
    }
}
