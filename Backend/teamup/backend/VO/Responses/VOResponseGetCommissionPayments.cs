using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO.Responses
{
    public class VOResponseGetCommissionPayments : VOResponse
    {
        public List<VOCommissionPaymentAdmin> Commissions;

        public VOResponseGetCommissionPayments() { }

        public VOResponseGetCommissionPayments(List<VOCommissionPaymentAdmin> commissions)
        {
            Commissions = commissions;
        }
    }
}
