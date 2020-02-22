using backend.Data_Access.VO.Data;
using System.Collections.Generic;

namespace backend.Data_Access.VO
{
    public class VOResponseGetSpace : VOResponse
    {
        public VOPublication Publication;
        public List<VOPublication> RelatedPublications;
        public bool Favorite { get; set; }
        public List<VOPublicationQuestion> Questions;        
        public List<VOPublication> OtherPublicationConfig;

        public VOResponseGetSpace() { }
        public VOResponseGetSpace(VOPublication publication, bool favorite, List<VOPublication> related, List<VOPublicationQuestion> questions, List<VOPublication> otherPublicationConfig)
        {
            Publication = publication;
            Favorite = favorite;
            RelatedPublications = related;
            Questions = questions;
            OtherPublicationConfig = otherPublicationConfig;
        }
    }
}
