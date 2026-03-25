type SendPrivateReplyInput = {
  accessToken: string;
  commentId: string;
  message: string;
};

export async function sendInstagramPrivateReply(
  input: SendPrivateReplyInput
) {
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${input.commentId}/private_replies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input.message,
        access_token: input.accessToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao enviar private reply");
  }

  return data;
}
