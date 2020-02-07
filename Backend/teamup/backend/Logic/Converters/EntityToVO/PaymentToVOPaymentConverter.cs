using backend.Data_Access.VO.Data;
using backend.Logic.Entities;

namespace backend.Logic.Converters.EntityToVO
{
    public static class PaymentToVOPaymentConverter
    {
        public static VOPayment Convert(Payment payment)
        {
            VOPayment voPayment = new VOPayment
            {
                PaymentState = payment.PaymentState,
                PaymentDescription  = payment.PaymentDescription,
                PaymentComment = payment.PaymentComment,
                PaymentEvidence = payment.PaymentEvidence,
                PaymentDate = payment.PaymentDate,
                Commission = payment.Commission
            };
            return voPayment;
        }
    }
}
