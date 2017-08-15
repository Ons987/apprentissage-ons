using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace LoginRegistration.Models
{
    public class UserAttachment
    {
        [Key]
        public int UserAttachmentId { get; set; }

        public int UserID { get; set; }
        [ForeignKey(nameof(UserID))]
        public virtual UserAccount UserAccount { get; set; }

        public string ContainerName { get; set; }
        public string ResourceName { get; set; }
        public string SasQueryString { get; set; }
        public string AttachmentUri { get; set; }

        public UserAttachmentType UserAttachmentType { get; set; }

    }
    public enum UserAttachmentType
    {
        None = 0,
        Picture = 1
    }
}