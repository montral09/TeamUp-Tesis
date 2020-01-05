using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace backend.Data_Access.VO
{
    public class VOResponsePublicationPendingApproval : VOResponse
    {
        public List<VOPublicationAdmin> Publications { get; set; }

        public VOResponsePublicationPendingApproval() { }

        public VOResponsePublicationPendingApproval(List<VOPublicationAdmin> publications)
        {
            Publications = publications;
        }
    }
}
