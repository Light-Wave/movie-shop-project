import { prisma } from "@/lib/prisma";

export default async function ManageUserDetailPage({
  params,
}: {
  params: { userID: string };
}) {
  const userId = params.userID;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">User not found</h1>
      </div>
    );
  }

  const roleMap = {
    USER: "User",
    ADMIN: "Admin",
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage User: {user.name}</h1>
      <div className="space-y-4">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {roleMap[user.role as keyof typeof roleMap]}
        </p>
        <p>
          <strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}