import UserSupportChatClient from "@/components/dashboard/shared/support/UserSupportChatClient";

type Params = {
  conversationId: string;
};

export default async function SupporterSupportConversationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { conversationId } = await params;

  return <UserSupportChatClient conversationId={conversationId} />;
}
