using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LoginRegistration.Models
{
    public class UserProfileEditModel
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
        public string Photo { get; set; }

    }
}