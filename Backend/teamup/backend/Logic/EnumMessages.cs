using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Logic
{
    public enum EnumMessages
    {
        // General success message
        OK,
        //System errors
        ERR_SYSTEM,
        //Users
        ERR_USRMAILNOTEXIST,
        ERR_USRWRONGPASS,
        SUCC_USRLOGSUCCESS,
        ERR_MAILALREADYEXIST,
        SUCC_USRCREATED,
        SUCC_USRUPDATED,
        SUCC_USRDELETED,
        SUCC_PUBLISHERSOK,
        SUCC_CUSTOMERSOK,
        SUCC_USERSOK,
        ERR_MAILNOTVALIDATED,
        SUCC_PASSWORDUPDATED,
        SUCC_EMAILVALIDATED,
        ERR_ACTIVATIONCODENOTEXIST,
        SUCC_VERIFICATIONMAILSENT,
        //SpaceTypes
        SUCC_SPACETYPESOK,
        //Locations
        SUCC_LOCATIONSOK,
        //ReservationTypes
        SUCC_RESERVATIONTYPESOK,
        //Facilities
        SUCC_FACILITIESOK,
        //Publications
        SUCC_PUBLICATIONCREATED,
        SUCC_PUBLICATIONAPPROVED,
        SUCC_PUBLICATIONSOK,
        SUCC_PUBLICATIONUPDATED,
        ERR_INVALIDUPDATE,
        ERR_SPACENOTFOUND,
        //Publication plans
        SUCC_PUBLICATIONPLANSOK,
        SUCC_PAYMENTUPDATED,
        //Favorites
        SUCC_FAVORITESOK,
        SUCC_FAVORITEUPDATED,
        //Tokens
        ERR_ACCESSTOKENEXPIRED,
        ERR_INVALIDACCESSTOKEN,
        ERR_REFRESHTOKENEXPIRED,
        ERR_INVALIDREFRESHTOKEN,
        SUCC_TOKENSUPDATED,
        //Reservations
        SUCC_RESERVATIONCREATED,
        SUCC_RESERVATIONSOK,
        SUCC_RESERVATIONUPDATED,
        //Reviews
        SUCC_REVIEWCREATED,
        //Questions
        SUCC_QUESTIONCREATED,
        SUCC_ANSWERCREATED,
        //Commissions
        SUCC_COMMISSIONSSOK,
        SUCC_COMMISSIONUPDATED,
        //Recommended
        SUCC_RECOMMENDEDOK,
        //Messages
        SUCC_MESSAGESOK,
        // Messages for deletion validations
        ERR_PENDINGRESERVATIONCUSTOMER,
        ERR_PENDINGRESERVATIONPAYMENT,
        ERR_PENDINGPUBLICATION,
        ERR_PENDINGRESERVATIONPUBLISHER,
        ERR_PENDINGPREFERENTIALPAYMENT,
        ERR_PENDINGCOMMISSIONPAYMENT
    }
    
}
