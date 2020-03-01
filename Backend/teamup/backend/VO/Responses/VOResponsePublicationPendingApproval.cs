using backend.Data_Access.VO.Data;
using System.Collections.Generic;

namespace backend.Data_Access.VO
{
    public class VOResponsePublicationPendingApproval : VOResponse
    {
        public List<VOPublication> Publications { get; set; }

        public VOResponsePublicationPendingApproval() { }

        public VOResponsePublicationPendingApproval(List<VOPublication> publications)
        {
            Publications = publications;
        }
    }
}
