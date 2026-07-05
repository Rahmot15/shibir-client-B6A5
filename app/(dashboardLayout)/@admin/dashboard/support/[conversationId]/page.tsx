import AdminSupportChatClient from "@/components/dashboard/shared/support/AdminSupportChatClient";

type Params = {
  conversationId: string;
};

export default async function AdminSupportConversationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { conversationId } = await params;

  return <AdminSupportChatClient conversationId={conversationId} />;
}
