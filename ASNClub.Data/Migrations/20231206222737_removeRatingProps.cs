using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ASNClub.Data.Migrations
{
    public partial class removeRatingProps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Ratings_RatingId",
                table: "Likes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ratings_Comments_CommentId",
                table: "Ratings");

            migrationBuilder.DropIndex(
                name: "IX_Ratings_CommentId",
                table: "Ratings");

            migrationBuilder.DropColumn(
                name: "CommentId",
                table: "Ratings");

            migrationBuilder.DropColumn(
                name: "RatedOn",
                table: "Ratings");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Ratings_RatingId",
                table: "Likes",
                column: "RatingId",
                principalTable: "Ratings",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Likes_Ratings_RatingId",
                table: "Likes");

            migrationBuilder.AddColumn<Guid>(
                name: "CommentId",
                table: "Ratings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "RatedOn",
                table: "Ratings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_CommentId",
                table: "Ratings",
                column: "CommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Likes_Ratings_RatingId",
                table: "Likes",
                column: "RatingId",
                principalTable: "Ratings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ratings_Comments_CommentId",
                table: "Ratings",
                column: "CommentId",
                principalTable: "Comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}
