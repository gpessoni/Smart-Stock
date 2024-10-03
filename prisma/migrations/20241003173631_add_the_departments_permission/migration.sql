/*
  Warnings:

  - You are about to drop the column `usersId` on the `Permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permissions" DROP CONSTRAINT "Permissions_usersId_fkey";

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "usersId";

-- CreateTable
CREATE TABLE "_PermissionsToUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DepartmentsToPermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionsToUsers_AB_unique" ON "_PermissionsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionsToUsers_B_index" ON "_PermissionsToUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DepartmentsToPermissions_AB_unique" ON "_DepartmentsToPermissions"("A", "B");

-- CreateIndex
CREATE INDEX "_DepartmentsToPermissions_B_index" ON "_DepartmentsToPermissions"("B");

-- AddForeignKey
ALTER TABLE "_PermissionsToUsers" ADD CONSTRAINT "_PermissionsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToUsers" ADD CONSTRAINT "_PermissionsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentsToPermissions" ADD CONSTRAINT "_DepartmentsToPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentsToPermissions" ADD CONSTRAINT "_DepartmentsToPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
