using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSoldQuantityToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "73a43c4c-e583-4a10-96b4-5bb738c067de");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b9b88f68-3dfd-47d3-93a4-6fc07ce77bf2");

            migrationBuilder.AddColumn<int>(
                name: "SoldQuantity",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6b61edc9-a604-4ff2-81b1-9014391c568f", null, "Admin", "ADMIN" },
                    { "812dace9-6769-42bb-8d22-ea2b725526df", null, "Customer", "CUSTOMER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6b61edc9-a604-4ff2-81b1-9014391c568f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "812dace9-6769-42bb-8d22-ea2b725526df");

            migrationBuilder.DropColumn(
                name: "SoldQuantity",
                table: "Products");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "73a43c4c-e583-4a10-96b4-5bb738c067de", null, "Admin", "ADMIN" },
                    { "b9b88f68-3dfd-47d3-93a4-6fc07ce77bf2", null, "Customer", "CUSTOMER" }
                });
        }
    }
}
