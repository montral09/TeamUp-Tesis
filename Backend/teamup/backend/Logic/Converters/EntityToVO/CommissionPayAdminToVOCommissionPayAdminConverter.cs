using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class CommissionPayAdminToVOCommissionPayAdminConverter
    {
        public static VOCommissionPaymentAdmin Convert(CommissionPaymentAdmin commission)
        {
            VOCommissionPaymentAdmin voCommission= new VOCommissionPaymentAdmin
            {
                IdReservation = commission.IdReservation,
                Publication = commission.Publication,
                PublisherMail = commission.PublisherMail,
                PublisherName = commission.PublisherName,
                PublisherLastName = commission.PublisherLastName,
                PublisherPhone = commission.PublisherPhone,
                Commission = commission.Commission,
                CommissionState = commission.CommissionState,
                Comment = commission.Comment,
                Evidence = commission.Evidence,
                PaymentDate = commission.PaymentDate

            };
            return voCommission;
        }

        public static List<VOCommissionPaymentAdmin> Convert(List<CommissionPaymentAdmin> commissions)
        {
            List<VOCommissionPaymentAdmin> voCommissions = new List<VOCommissionPaymentAdmin>();
            foreach (var commission in commissions)
            {
                voCommissions.Add(Convert(commission));
            }
            return voCommissions;
        }
    }
}
