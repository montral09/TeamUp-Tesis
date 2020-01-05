using backend.Data_Access.VO.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Data_Access.VO
{
    public class VOResponseGetSpace : VOResponse
    {
        public VOPublication Publication;
        public List<VOPublication> RelatedPublications;
        public bool Favorite { get; set; }
        public List<VOPublicationQuestion> Questions;

        public VOResponseGetSpace() { }
        public VOResponseGetSpace(VOPublication publication, bool favorite, List<VOPublication> related, List<VOPublicationQuestion> questions)
        {
            Publication = publication;
            Favorite = favorite;
            RelatedPublications = related;
            Questions = questions;
        }
    }
}
