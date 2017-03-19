using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace AspNetCoreRealTimeChart.Extensions
{
    public class TemperatureSocketMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TemperatureSocketManager _socketManager;

        public TemperatureSocketMiddleware(RequestDelegate next,
                                          TemperatureSocketManager socketManager)
        {
            _next = next;
            _socketManager = socketManager;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                await _next.Invoke(context);
                return;
            }

            var socket = await context.WebSockets.AcceptWebSocketAsync();
            var id = _socketManager.AddSocket(socket);

            await Receive(socket, async (result, buffer) =>
            {
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    await _socketManager.RemoveSocket(id);
                    return;
                }
            });
        }

        private async Task Receive(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            var buffer = new byte[1024 * 4];

            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(buffer: new ArraySegment<byte>(buffer),
                                                       cancellationToken: CancellationToken.None);

                handleMessage(result, buffer);
            }
        }
    }
}
