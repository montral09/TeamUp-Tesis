using System;

namespace backend.Logic
{
    public class UpdateStatePublicationData
    {
        public bool IsAdmin { get; set; }
        public int ActualState { get; set; }
       
        public UpdateStatePublicationData() { }

        public UpdateStatePublicationData(bool isAdmin, int actualState)
        {
            IsAdmin = isAdmin;
            ActualState = actualState;
        }
    }
}
