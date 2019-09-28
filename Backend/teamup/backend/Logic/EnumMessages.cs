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
        ERR_MAILNOTVALIDATED,
        SUCC_PASSWORDUPDATED,
        SUCC_EMAILVALIDATED,
        ERR_ACTIVATIONCODENOTEXIST,
        //SpaceTypes
        SUCC_SPACETYPESOK,
        //Locations
        SUCC_LOCATIONSOK,
        //Tokens
        ERR_ACCESSTOKENEXPIRED,
        ERR_INVALIDACCESSTOKEN,
        ERR_REFRESHTOKENEXPIRED,
        ERR_INVALIDREFRESHTOKEN


    }
    
}
