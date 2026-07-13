using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    public partial class AddDiscountToProduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Chỉ giữ lại lệnh thêm cột DiscountPercentage
            migrationBuilder.AddColumn<int>(
                name: "DiscountPercentage",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Chỉ giữ lại lệnh xóa cột (để dùng khi cần rollback)
            migrationBuilder.DropColumn(
                name: "DiscountPercentage",
                table: "Products");
        }
    }
}