import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { tipsApi } from '@/lib/database';
import { toast } from 'sonner';
import { Loader2, MapPin, Check, User } from 'lucide-react';
import { TipCategory } from '@/types';

// 첫 번째 계정용 팁들 (TestNomad1)
const SAMPLE_TIPS_USER1 = [
  {
    content: 'Amazing coworking cafe in Thonglor! Super fast WiFi (200+ Mbps), plenty of power outlets, and the best flat white in Bangkok ☕ Open 24/7 and very nomad-friendly. They even have phone booths for calls!',
    category: 'cafe' as TipCategory,
    images: ['https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7308, longitude: 100.5418, city: 'Bangkok', country: 'Thailand', address: 'Thonglor District' }
  },
  {
    content: 'BEST pad thai in Bangkok! This street vendor near Saphan Phut has been here for 30+ years. Only 60 THB and portions are huge! Go around 7-8pm for the freshest ingredients 🍜',
    category: 'food' as TipCategory,
    images: ['https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7465, longitude: 100.5351, city: 'Bangkok', country: 'Thailand', address: 'Saphan Phut Market' }
  },
  {
    content: 'Premium coworking space in Silom! Day pass is 500 THB, monthly unlimited is 8000 THB. Amazing facilities: meeting rooms, printing, fast WiFi, and great networking events 💻',
    category: 'workspace' as TipCategory,
    images: ['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7307, longitude: 100.5418, city: 'Bangkok', country: 'Thailand', address: 'Silom District' }
  },
  {
    content: 'Authentic Muay Thai gym in Thonglor! Very welcoming to beginners, English-speaking trainers, and great workout. 500 THB per session or 6000 THB monthly. Amazing way to stay fit! 🥊',
    category: 'exercise' as TipCategory,
    images: ['https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7280, longitude: 100.5450, city: 'Bangkok', country: 'Thailand', address: 'Thonglor District' }
  },
  {
    content: 'Essential apps for Bangkok nomads: Grab (transport), Foodpanda (delivery), Google Translate (Thai), and Wise (banking). Download these before you arrive! 📱',
    category: 'other' as TipCategory,
    location: { latitude: 13.7563, longitude: 100.5018, city: 'Bangkok', country: 'Thailand' }
  },
  {
    content: 'Hidden gem cafe in Ari! Local vibe, amazing Thai coffee, and super affordable. Perfect for morning work sessions. The owner speaks great English and loves chatting with nomads 😊',
    category: 'cafe' as TipCategory,
    images: ['https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7794, longitude: 100.5426, city: 'Bangkok', country: 'Thailand', address: 'Ari District' }
  },
  {
    content: 'Incredible vegetarian restaurant in Sukhumvit! They have amazing mock meat dishes that even carnivores love. Very clean, AC, and English menu. Perfect for nomads with dietary restrictions 🌱',
    category: 'food' as TipCategory,
    images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7563, longitude: 100.5018, city: 'Bangkok', country: 'Thailand', address: 'Sukhumvit Road' }
  },
  {
    content: 'Luxury serviced apartment in Sathorn with amazing city views! Monthly rates are very reasonable (35k THB), includes gym, pool, and coworking space. Perfect for longer stays 🏢',
    category: 'accommodation' as TipCategory,
    images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7200, longitude: 100.5300, city: 'Bangkok', country: 'Thailand', address: 'Sathorn District' }
  },
  {
    content: 'Free coworking space in Central Embassy mall! Yes, completely free! Great for short work sessions, has WiFi and charging stations. Plus you can grab food from the amazing food court 🛍️',
    category: 'workspace' as TipCategory,
    images: ['https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7440, longitude: 100.5416, city: 'Bangkok', country: 'Thailand', address: 'Central Embassy' }
  },
  {
    content: 'Beautiful yoga studio in Ari with English classes! Morning sessions at 7am are perfect before work. Very peaceful atmosphere and experienced teachers. Drop-in rate: 400 THB 🧘‍♀️',
    category: 'exercise' as TipCategory,
    images: ['https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7800, longitude: 100.5400, city: 'Bangkok', country: 'Thailand', address: 'Ari District' }
  },
  {
    content: 'Amazing rooftop bar in Sukhumvit with 360° city views! Happy hour 5-7pm with 50% off cocktails. Perfect for networking with other nomads and watching the sunset 🌅',
    category: 'entertainment' as TipCategory,
    images: ['https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7540, longitude: 100.5020, city: 'Bangkok', country: 'Thailand', address: 'Sukhumvit Soi 11' }
  },
  {
    content: 'Pro tip: Get a Rabbit Card for BTS/MRT! Much cheaper than individual tickets and works on buses too. You can top up at any station. Saves so much time and money! 🚇',
    category: 'transport' as TipCategory,
    images: ['https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7563, longitude: 100.5018, city: 'Bangkok', country: 'Thailand', address: 'BTS Siam Station' }
  },
  {
    content: 'Chatuchak Weekend Market is a must! Go early (8-9am) to avoid crowds. Amazing deals on clothes, accessories, and local crafts. Bring cash and bargaining skills! 🛍️',
    category: 'shopping' as TipCategory,
    images: ['https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7998, longitude: 100.5501, city: 'Bangkok', country: 'Thailand', address: 'Chatuchak Market' }
  },
  {
    content: 'Lumpini Park is perfect for morning runs! 6-7am is the best time - cooler weather and lots of locals exercising. Free outdoor gym equipment and beautiful lake views 🌳',
    category: 'nature' as TipCategory,
    images: ['https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7307, longitude: 100.5418, city: 'Bangkok', country: 'Thailand', address: 'Lumpini Park' }
  },
  {
    content: 'Learn basic Thai phrases! "Sawasdee" (hello), "Kob khun" (thank you), "Mai pen rai" (no problem). Locals really appreciate the effort and it makes everything easier! 🇹🇭',
    category: 'other' as TipCategory,
    location: { latitude: 13.7563, longitude: 100.5018, city: 'Bangkok', country: 'Thailand' }
  },
  {
    content: 'Best som tam (papaya salad) in Chinatown! This tiny stall has been family-run for generations. Super spicy but absolutely delicious. Only 40 THB and very authentic! 🌶️',
    category: 'food' as TipCategory,
    images: ['https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7392, longitude: 100.5095, city: 'Bangkok', country: 'Thailand', address: 'Chinatown' }
  },
  {
    content: 'Affordable gym in Phrom Phong with all modern equipment! Monthly membership only 1500 THB, includes classes and sauna. Very clean and not too crowded during the day 💪',
    category: 'exercise' as TipCategory,
    images: ['https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7300, longitude: 100.5700, city: 'Bangkok', country: 'Thailand', address: 'Phrom Phong' }
  },
  {
    content: 'Cool jazz bar in Thonglor with live music every night! Great atmosphere for dates or meeting other expats. Cocktails are pricey but worth it for the ambiance 🎷',
    category: 'entertainment' as TipCategory,
    images: ['https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7350, longitude: 100.5500, city: 'Bangkok', country: 'Thailand', address: 'Thonglor District' }
  },
  {
    content: 'MBK Center for electronics and phone accessories! Great prices and lots of variety. Perfect for nomads who need tech gear. Always compare prices between shops! 📱',
    category: 'shopping' as TipCategory,
    images: ['https://images.pexels.com/photos/1927574/pexels-photo-1927574.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7448, longitude: 100.5300, city: 'Bangkok', country: 'Thailand', address: 'MBK Center' }
  },
  {
    content: 'Benjakitti Park has amazing skyline views and is less crowded than Lumpini! Great for photography, especially during sunset. The lake reflection shots are incredible! 📸',
    category: 'nature' as TipCategory,
    images: ['https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7220, longitude: 100.5600, city: 'Bangkok', country: 'Thailand', address: 'Benjakitti Park' }
  }
];

// 두 번째 계정용 팁들 (TestNomad2)
const SAMPLE_TIPS_USER2 = [
  {
    content: 'Cozy cafe in Ekkamai perfect for design work! Great natural lighting, comfortable seating, and they don\'t mind if you stay all day. Amazing matcha latte too! 🍵',
    category: 'cafe' as TipCategory,
    images: ['https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7200, longitude: 100.5900, city: 'Bangkok', country: 'Thailand', address: 'Ekkamai District' }
  },
  {
    content: 'Incredible khao soi at this Northern Thai restaurant in Ari! Authentic recipe from Chiang Mai, perfect coconut curry noodles. Only 120 THB and so comforting 🍲',
    category: 'food' as TipCategory,
    images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7750, longitude: 100.5380, city: 'Bangkok', country: 'Thailand', address: 'Ari District' }
  },
  {
    content: 'Modern hostel in Ratchathewi with pod-style beds! Super clean, great for solo travelers, and has a rooftop terrace. 600 THB/night including breakfast 🏨',
    category: 'accommodation' as TipCategory,
    images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7600, longitude: 100.5300, city: 'Bangkok', country: 'Thailand', address: 'Ratchathewi District' }
  },
  {
    content: 'Creative coworking space in Talad Rot Fai! Converted from old train market, super unique atmosphere. Great for creative work and networking with local entrepreneurs 🚂',
    category: 'workspace' as TipCategory,
    images: ['https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7950, longitude: 100.5550, city: 'Bangkok', country: 'Thailand', address: 'Talad Rot Fai' }
  },
  {
    content: 'Pilates studio in Phrom Phong with English instructors! Small classes, personalized attention, and great for core strength. 800 THB per class but worth every baht 🤸‍♀️',
    category: 'exercise' as TipCategory,
    images: ['https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7280, longitude: 100.5650, city: 'Bangkok', country: 'Thailand', address: 'Phrom Phong' }
  },
  {
    content: 'Artsy cinema in Siam showing indie films! They have English subtitles and comfy bean bag seating. Perfect for a chill evening, tickets only 200 THB 🎬',
    category: 'entertainment' as TipCategory,
    images: ['https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7460, longitude: 100.5330, city: 'Bangkok', country: 'Thailand', address: 'Siam Square' }
  },
  {
    content: 'Best taxi app in Bangkok: Bolt! Usually cheaper than Grab and drivers are more reliable. Always use the app instead of street taxis to avoid scams. Works great for nomads! 🚗',
    category: 'transport' as TipCategory,
    images: ['https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7500, longitude: 100.5200, city: 'Bangkok', country: 'Thailand', address: 'Central Bangkok' }
  },
  {
    content: 'Terminal 21 mall has themed floors from different countries! Great for shopping and the food court on 5th floor has amazing variety. Don\'t miss the Tokyo floor! 🗼',
    category: 'shopping' as TipCategory,
    images: ['https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7370, longitude: 100.5600, city: 'Bangkok', country: 'Thailand', address: 'Terminal 21' }
  },
  {
    content: 'Queen Sirikit Park is perfect for picnics and outdoor work! Less touristy than other parks, has free WiFi, and beautiful gardens. Great for video calls too! 🌺',
    category: 'nature' as TipCategory,
    images: ['https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7100, longitude: 100.5400, city: 'Bangkok', country: 'Thailand', address: 'Queen Sirikit Park' }
  },
  {
    content: 'Download LINE app - it\'s essential in Thailand! Used for everything from ordering food to paying bills. Most locals prefer it over WhatsApp 📱',
    category: 'other' as TipCategory,
    location: { latitude: 13.7563, longitude: 100.5018, city: 'Bangkok', country: 'Thailand' }
  },
  {
    content: 'Amazing mango sticky rice at this dessert shop in Siam! They use the best quality mangoes and the coconut milk is perfectly sweet. Only 80 THB! 🥭',
    category: 'food' as TipCategory,
    images: ['https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7450, longitude: 100.5320, city: 'Bangkok', country: 'Thailand', address: 'Siam Square' }
  },
  {
    content: 'Boutique hotel in Silom with amazing design! Each room is uniquely decorated by local artists. A bit pricey (3000 THB/night) but perfect for special occasions 🎨',
    category: 'accommodation' as TipCategory,
    images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7250, longitude: 100.5350, city: 'Bangkok', country: 'Thailand', address: 'Silom District' }
  },
  {
    content: 'Library coworking space in Chulalongkorn University area! Super quiet, academic atmosphere, and very affordable. Perfect for deep focus work sessions 📚',
    category: 'workspace' as TipCategory,
    images: ['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7350, longitude: 100.5300, city: 'Bangkok', country: 'Thailand', address: 'Chulalongkorn University' }
  },
  {
    content: 'Rock climbing gym in Huai Khwang! Great for building strength and meeting active expats. Day pass is 400 THB including equipment rental 🧗‍♀️',
    category: 'exercise' as TipCategory,
    images: ['https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7700, longitude: 100.5750, city: 'Bangkok', country: 'Thailand', address: 'Huai Khwang' }
  },
  {
    content: 'Night market in Saphan Phut for vintage finds! Open Thursday-Sunday evenings, great for unique clothes and accessories. Bargaining is expected! 🌙',
    category: 'entertainment' as TipCategory,
    images: ['https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7400, longitude: 100.5100, city: 'Bangkok', country: 'Thailand', address: 'Saphan Phut' }
  },
  {
    content: 'Motorcycle taxi stands are everywhere! Perfect for short distances and beating traffic. Always wear the helmet they provide and agree on price first 🏍️',
    category: 'transport' as TipCategory,
    images: ['https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7563, longitude: 100.5018, city: 'Bangkok', country: 'Thailand' }
  },
  {
    content: 'Platinum Fashion Mall for wholesale clothes shopping! Great prices if you buy in bulk, perfect for nomads who need to refresh their wardrobe cheaply 👕',
    category: 'shopping' as TipCategory,
    images: ['https://images.pexels.com/photos/1927574/pexels-photo-1927574.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7520, longitude: 100.5380, city: 'Bangkok', country: 'Thailand', address: 'Platinum Fashion Mall' }
  },
  {
    content: 'Chao Phraya River boat is a great way to see the city! Much cheaper than taxis for long distances and you get amazing views. Buy a day pass for 150 THB ⛵',
    category: 'transport' as TipCategory,
    images: ['https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7400, longitude: 100.5100, city: 'Bangkok', country: 'Thailand', address: 'Chao Phraya River' }
  },
  {
    content: 'Rod Fai Night Market in Ratchada for authentic street food! Less touristy than other markets, amazing local atmosphere. Try the grilled seafood! 🦐',
    category: 'food' as TipCategory,
    images: ['https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: { latitude: 13.7600, longitude: 100.5650, city: 'Bangkok', country: 'Thailand', address: 'Ratchada Night Market' }
  },
  {
    content: 'Get a local SIM card at 7-Eleven! AIS and True have good tourist packages with unlimited data. Much cheaper than international roaming 📶',
    category: 'other' as TipCategory,
    location: { latitude: 13.7563, longitude: 100.5018, city: 'Bangkok', country: 'Thailand' }
  }
];

interface AddSampleTipsProps {
  userId?: string;
  userNickname?: string;
}

export function AddSampleTips({ userId, userNickname }: AddSampleTipsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addedTips, setAddedTips] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');

  // 사용자에 따라 다른 팁 세트 선택
  const getTipsForUser = () => {
    if (userNickname === 'TestNomad1') {
      return SAMPLE_TIPS_USER1;
    } else if (userNickname === 'TestNomad2') {
      return SAMPLE_TIPS_USER2;
    } else {
      // 기본적으로 첫 번째 세트 사용
      return SAMPLE_TIPS_USER1;
    }
  };

  const sampleTips = getTipsForUser();

  const addSampleTips = async () => {
    if (!userId) {
      toast.error('Please sign in first to add sample tips');
      return;
    }

    setIsAdding(true);
    setAddedTips([]);
    const added: string[] = [];

    try {
      for (let i = 0; i < sampleTips.length; i++) {
        const tipData = sampleTips[i];
        setCurrentStep(`Adding tip ${i + 1}/${sampleTips.length}: ${tipData.content.slice(0, 30)}...`);
        
        try {
          const tip = await tipsApi.createTip({
            user_id: userId,
            ...tipData
          });
          
          toast.success(`✅ Added tip ${i + 1}: ${tipData.content.slice(0, 30)}...`);
          added.push(tip.id);
          setAddedTips([...added]);
          
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (error) {
          console.error('Error adding tip:', error);
          toast.error(`Failed to add tip ${i + 1}: ${tipData.content.slice(0, 30)}...`);
        }
      }

      setCurrentStep('');
      
      if (added.length === sampleTips.length) {
        toast.success(`🎉 All ${added.length} sample tips added for ${userNickname}!`);
      } else {
        toast.info(`Added ${added.length}/${sampleTips.length} tips for ${userNickname}`);
      }
    } catch (error) {
      console.error('Error adding sample tips:', error);
      toast.error('Failed to add sample tips');
    } finally {
      setIsAdding(false);
      setCurrentStep('');
    }
  };

  if (!userId) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Add Sample Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Please sign in to add sample tips to your account
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Add Sample Tips for {userNickname}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Customized tips for {userNickname}:</strong> {sampleTips.length} unique Bangkok nomad tips 
            {userNickname === 'TestNomad1' && ' (Developer focused)'}
            {userNickname === 'TestNomad2' && ' (Designer focused)'}
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Sample Tips Preview:</h4>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {sampleTips.slice(0, 5).map((tip, index) => (
              <div 
                key={index}
                className="flex items-start justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)} Tip
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tip.content.slice(0, 80)}...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    📍 {tip.location.address || tip.location.city}
                  </div>
                </div>
                {addedTips.length > index && (
                  <Check className="w-4 h-4 text-green-600 mt-1" />
                )}
              </div>
            ))}
            {sampleTips.length > 5 && (
              <div className="text-xs text-muted-foreground text-center py-2">
                ... and {sampleTips.length - 5} more tips
              </div>
            )}
          </div>
        </div>

        {currentStep && (
          <div className="text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded">
            {currentStep}
          </div>
        )}

        <Button 
          onClick={addSampleTips}
          disabled={isAdding || addedTips.length === sampleTips.length}
          className="w-full"
        >
          {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {addedTips.length === sampleTips.length 
            ? '✅ All Tips Added' 
            : isAdding 
              ? 'Adding Tips...' 
              : `Add ${sampleTips.length} Sample Tips`
          }
        </Button>

        {addedTips.length > 0 && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            ✅ Added {addedTips.length}/{sampleTips.length} tips for {userNickname}
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-700">
            <strong>Tip categories included:</strong> Cafes, Food, Workspaces, Exercise, Entertainment, Transport, Shopping, Nature, and General tips - all focused on Bangkok nomad life!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}