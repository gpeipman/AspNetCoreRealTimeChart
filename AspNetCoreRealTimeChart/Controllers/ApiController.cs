using System;
using System.Threading.Tasks;
using AspNetCoreRealTimeChart.Extensions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AspNetCoreRealTimeChart.Controllers
{
    public class ApiController : Controller
    {
        private readonly TemperatureSocketManager _socketManager;

        public ApiController(TemperatureSocketManager socketManager)
        {
            _socketManager = socketManager;
        }

        public async Task Report(double liquidTemp)
        {
            var reading = new
            {
                Date = DateTime.Now,
                LiquidTemp = liquidTemp
            };

            await _socketManager.SendMessageToAllAsync(JsonConvert.SerializeObject(reading));
        }

        public async Task Generate()
        {
            var rnd = new Random();

            for(var i = 0; i < 100; i++)
            {                
                await Report(rnd.Next(23, 35));
                await Task.Delay(5000);
            }
        }
    }
}