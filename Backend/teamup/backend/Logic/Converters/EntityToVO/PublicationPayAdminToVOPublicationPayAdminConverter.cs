using backend.Data_Access.VO.Data;
using backend.Logic.Entities;
using System.Collections.Generic;

namespace backend.Logic.Converters.EntityToVO
{
    public static class PublicationPayAdminToVOPublicationPayAdminConverter
    {
        public static VOPublicationPaymentAdmin Convert(PublicationPaymentAdmin payment)
        {
            VOPublicationPaymentAdmin voPyament = new VOPublicationPaymentAdmin
            {
                IdPublication = payment.IdPublication,
                Publication = payment.Publication,
                PublisherMail = payment.PublisherMail,
                PublisherName = payment.PublisherName,
                PublisherLastName = payment.PublisherLastName,
                PublisherPhone = payment.PublisherPhone,
                PreferentialPlanName = payment.PreferentialPlanName,
                PreferentialPlanState = payment.PreferentialPlanState,
                Price = payment.Price,
                Comment = payment.Comment,
                Evidence = payment.Evidence,
                PaymentDate = payment.PaymentDate
        };
            return voPyament;
        }

        public static List<VOPublicationPaymentAdmin> Convert(List<PublicationPaymentAdmin> payments)
        {
            List<VOPublicationPaymentAdmin> voPayments = new List<VOPublicationPaymentAdmin>();
            if (payments != null && payments.Count != 0)
            {
                foreach (var payment in payments)
                {
                    voPayments.Add(Convert(payment));
                }
            }
            return voPayments;
        }
    }
}
