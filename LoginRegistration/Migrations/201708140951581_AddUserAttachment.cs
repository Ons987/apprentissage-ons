namespace LoginRegistration.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserAttachment : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserAttachments",
                c => new
                    {
                        UserAttachmentId = c.Int(nullable: false, identity: true),
                        UserID = c.Int(nullable: false),
                        ContainerName = c.String(),
                        ResourceName = c.String(),
                        SasQueryString = c.String(),
                        AttachmentUri = c.String(),
                        UserAttachmentType = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.UserAttachmentId)
                .ForeignKey("dbo.UserAccounts", t => t.UserID, cascadeDelete: true)
                .Index(t => t.UserID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserAttachments", "UserID", "dbo.UserAccounts");
            DropIndex("dbo.UserAttachments", new[] { "UserID" });
            DropTable("dbo.UserAttachments");
        }
    }
}
