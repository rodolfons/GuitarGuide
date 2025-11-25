using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuitarGuide.Migrations
{
    /// <inheritdoc />
    public partial class AddTablatureJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TablatureJson",
                table: "Songs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TablatureJson",
                table: "Songs");
        }
    }
}
