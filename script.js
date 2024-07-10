window.onload = function () {
  alert("Page loaded");
};

document
  .getElementById("token-or-webhook")
  .addEventListener("change", function () {
    const tokenOrWebhook = this.value;
    const tokenFields = document.getElementById("token-fields");
    const webhookFields = document.getElementById("webhook-fields");

    if (tokenOrWebhook === "token") {
      tokenFields.style.display = "block";
      webhookFields.style.display = "none";
    } else {
      tokenFields.style.display = "none";
      webhookFields.style.display = "block";
    }
  });

document
  .getElementById("message-or-embed")
  .addEventListener("change", function () {
    const messageOrEmbed = this.value;
    const messageFields = document.getElementById("message-fields");
    const embedFields = document.getElementById("embed-fields");

    if (messageOrEmbed === "message") {
      messageFields.style.display = "block";
      embedFields.style.display = "none";
    } else {
      messageFields.style.display = "none";
      embedFields.style.display = "block";
    }
  });

document
  .querySelector(".submit")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const tokenOrWebhook = document.getElementById("token-or-webhook").value;
    const messageOrEmbed = document.getElementById("message-or-embed").value;
    let payload = {};

    if (tokenOrWebhook === "token") {
      payload.token = document.getElementById("token").value;
      payload.channelId = document.getElementById("channel-id").value;
    } else {
      payload.webhookUrl = document.getElementById("webhook-url").value;
    }

    if (messageOrEmbed === "message") {
      payload.content = document.getElementById("message-content").value;
    } else {
      // Validation du titre et de la description pour l'embed
      const embedTitle = document.getElementById("embed-title").value.trim();
      const embedDescription = document
        .getElementById("embed-description")
        .value.trim();

      if (!embedTitle || !embedDescription) {
        alert("Title and Description are required for Embed message.");
        return;
      }

      payload.embed = {
        color: parseInt(
          document.getElementById("embed-color").value.replace("#", ""),
          16
        ),
        title: embedTitle,
        url: document.getElementById("embed-url").value,
        author: {
          name: document.getElementById("embed-author").value,
        },
        description: embedDescription,
        thumbnail: {
          url: document.getElementById("embed-thumbnail").value,
        },
        fields: JSON.parse(
          document.getElementById("embed-fields-json").value || "[]"
        ),
        image: {
          url: document.getElementById("embed-image").value,
        },
        timestamp: document.getElementById("embed-timestamp").checked
          ? new Date().toISOString()
          : null,
        footer: {
          text: document.getElementById("embed-footer").value,
        },
      };
    }

    try {
      let response;

      if (tokenOrWebhook === "token") {
        response = await fetch(
          `https://discord.com/api/v9/channels/${payload.channelId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bot ${payload.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: payload.content,
              embeds: messageOrEmbed === "embed" ? [payload.embed] : [],
            }),
          }
        );
      } else {
        response = await fetch(payload.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: messageOrEmbed === "message" ? payload.content : null,
            embeds: messageOrEmbed === "embed" ? [payload.embed] : null,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("An error occurred while sending the message.");
    }
  });
