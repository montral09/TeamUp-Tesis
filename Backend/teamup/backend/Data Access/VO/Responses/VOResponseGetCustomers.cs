using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetCustomers : VOResponse
    {
        public List<VOCustomer> voCustomers;

        public VOResponseGetCustomers() { }
        public VOResponseGetCustomers(List<VOCustomer> voCustomers)
        {
            this.voCustomers = voCustomers;
        }
    }
}
