using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Logic
{
    public enum EnumMessages
    {

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
        //SpaceTypes
        SUCC_SPACETYPESOK,
        //Locations
        SUCC_LOCATIONSOK


    }
    
}
