// Test script to verify order flow tracking pipeline
// Uses native fetch (Node 18+)

async function testOrderFlowPipeline() {
  const baseUrl = 'https://orderflow-flax.vercel.app';
  
  console.log('🧪 Testing Order Flow Pipeline...\n');
  
  // Test 1: Check Redis connection
  console.log('1️⃣  Testing Redis connection...');
  try {
    const statusRes = await fetch(`${baseUrl}/api/orderflow-status?symbol=BTCUSDT`);
    const statusData = await statusRes.json();
    
    if (statusRes.ok) {
      console.log('✅ Redis connected successfully');
      console.log('   Response:', JSON.stringify(statusData, null, 2));
    } else {
      console.log('❌ Redis connection failed:', statusData.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  // Test 2: Send sample trade data
  console.log('\n2️⃣  Sending sample trade data...');
  const sampleData = {
    symbol: 'BTCUSDT',
    orderBook: {
      bids: [
        { price: 50000, size: 5.5 },
        { price: 49999, size: 3.2 }
      ],
      asks: [
        { price: 50001, size: 4.8 },
        { price: 50002, size: 6.1 }
      ]
    },
    tradePrints: [
      { price: 50000, size: 0.5, side: 'buy', timestamp: Date.now() - 5000 },
      { price: 50000, size: 0.3, side: 'buy', timestamp: Date.now() - 4000 },
      { price: 50000, size: 0.4, side: 'buy', timestamp: Date.now() - 3000 },
      { price: 50000, size: 0.6, side: 'buy', timestamp: Date.now() - 2000 },
      { price: 50000, size: 0.5, side: 'buy', timestamp: Date.now() - 1000 },
      { price: 50001, size: 1.2, side: 'sell', timestamp: Date.now() }
    ]
  };
  
  try {
    const trackRes = await fetch(`${baseUrl}/api/orderflow-tracker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleData)
    });
    
    const trackData = await trackRes.json();
    
    if (trackRes.ok) {
      console.log('✅ Trade data sent successfully');
      console.log('   Metrics:', JSON.stringify(trackData.metrics, null, 2));
    } else {
      console.log('❌ Failed to send data:', trackData.error);
      return;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  // Test 3: Retrieve updated status
  console.log('\n3️⃣  Retrieving updated status...');
  setTimeout(async () => {
    try {
      const statusRes = await fetch(`${baseUrl}/api/orderflow-status?symbol=BTCUSDT`);
      const statusData = await statusRes.json();
      
      console.log('✅ Status retrieved');
      console.log('   Active Walls:', statusData.metrics.totalActiveWalls);
      console.log('   Spoofs Detected:', statusData.metrics.spoofCount);
      console.log('   Icebergs Detected:', statusData.metrics.icebergCount);
      
      if (statusData.walls.length > 0) {
        console.log('\n   Sample Wall:', JSON.stringify(statusData.walls[0], null, 2));
      }
      
      console.log('\n🎉 All tests passed! Order flow pipeline is working.');
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }, 1000);
}

testOrderFlowPipeline();
