import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface TokenRequest {
  theme?: 'light' | 'dark';
  type?: 'technical' | 'sentiment' | 'market-news' | 'risk-calculator' | 
        'performance-stats' | 'calendar' | 'volatility' | 'favorites';
  language?: string;
  showAll?: boolean;
}

export async function POST(request: Request) {
  try {
    const { 
      theme = 'light', 
      type = 'technical', 
      language = 'en',
      showAll = true,
    } = await request.json() as TokenRequest;

    // Configuration - should be environment variables in production
    const config = {
      brokerId: '997',
      secretKey: '77f0fe5cca6b',
      userId: 'Zuperior',
      accountType: 'LIVE',
      locale: 'en_GB',
      layout: 'horizontal',
      tradeNow: 'n'
    };

    // Generate token with 1 hour expiry
    const expiry = Math.floor(Date.now() / 1000) + 300;
    const tokenString = `${config.userId}|${config.accountType === 'LIVE' ? '0' : '1'}|${expiry}${config.secretKey}`;
    const token = crypto.createHash('md5').update(tokenString).digest('hex');

    let url: string;

    switch (type) {
      case 'sentiment':
        // News Sentiment URL
        url = `https://news-sentiment.autochartist.com/news-sentiment?${new URLSearchParams({
          theme: theme,
          broker_id: config.brokerId,
          account_type: config.accountType,
          user: config.userId,
          expire: expiry.toString(),
          token: token,
          language: language
        }).toString()}`;
        break;

      case 'market-news':
        // Market News URL
        const marketNewsParams = new URLSearchParams({
          broker_id: config.brokerId,
          account_type: config.accountType,
          user: config.userId,
          expire: expiry.toString(),
          token: token,
          locale: language
        });
        marketNewsParams.append('css', 
          theme === 'dark' 
            ? 'https://broker-resources.autochartist.com/css/components/997-news-feeds-app_ds.css'
            : 'https://broker-resources.autochartist.com/css/components/997-news-feeds-app.css'
        );
        url = `https://component.autochartist.com/news/stock-news?${marketNewsParams.toString()}`;
        break;

      case 'risk-calculator':
        // Risk Calculator URL
        const riskCalcParams = new URLSearchParams({
          broker_id: config.brokerId,
          token: token,
          expire: expiry.toString(),
          user: config.userId,
          locale: language,
          account_type: config.accountType
        });
        riskCalcParams.append('css', 
          theme === 'dark'
            ? 'https://broker-resources.autochartist.com/css/components/997-rc-app_ds.css'
            : 'https://broker-resources.autochartist.com/css/components/997-rc-app.css'
        );
        url = `https://component.autochartist.com/rc/?${riskCalcParams.toString()}#!/`;
        break;

      case 'performance-stats':
        // Performance Statistics URL
        const perfStatsParams = new URLSearchParams({
          broker_id: config.brokerId,
          user: config.userId,
          account_type: config.accountType,
          expire: expiry.toString(),
          locale: config.locale,
          theme: theme,
          token: token
        });
        perfStatsParams.append('css', 
          'https://perfstats.autochartist.com/performance-stats-v3/css/performance_stats_v3.css'
        );
        url = `https://perfstats.autochartist.com/performance-stats-v3/?${perfStatsParams.toString()}`;
        break;

      case 'calendar':
        // Calendar URL
        const calendarParams = new URLSearchParams({
          broker_id: config.brokerId,
          showall: showAll.toString(),
          token: token,
          expire: expiry.toString(),
          user: config.userId,
          locale: language
        });
        if (theme === 'dark') calendarParams.append('style', 'ds');
        url = `https://eia.autochartist.com/calendar/?${calendarParams.toString()}#!/calendar`;
        break;

      case 'volatility':
        // Volatility Analysis URL
        const volatilityParams = new URLSearchParams({
          account_type: config.accountType,
          broker_id: config.brokerId,
          token: token,
          expire: expiry.toString(),
          user: config.userId,
          locale: language === 'en' ? 'en-GB' : language
        });
        if (theme === 'dark') {
          volatilityParams.append('style', 'ds');
          volatilityParams.append('chart_style', 
            'AAz_AAAA_______MzMz_________________o1yi______-jXKL_YkKl______9iQqX______6Ncov______YkKl____________AAAA_2JCpf8kSiz_o1yi_7M8AAAJTS9kIEhIOm1tAAZkL00veXkACiMsIyMwLjAwMDAABUFyaWFs_wAA______________________8BAQH_SHax_2Sxiv__gED_AAAAAAA_gAAAQCAAAABKaHR0cHM6Ly9icm9rZXJzbG9nb3MuYXV0b2NoYXJ0aXN0LmNvbS9jdXN0b20tY2hhcnRzL2RhcmstenVwZXJpb3ItbG9nby5wbmc-TMzNAA1NaWRkbGUgQ2VudGVyP4AAAAAAAAAAAAAAABBhdXRvY2hhcnRpc3QuY29t__-AQAAAAAEAAAAAAf__gED__4BA__-AQP8bAi4AAAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD5MzM0_gAAAAAAAAAAAAAAAAAAMAAAADAAAAAAAAAAAAAAAAA4AAAASAQ'
          );
        }
        url = `https://component.autochartist.com/va/#/results?${volatilityParams.toString()}`;
        break;

      case 'favorites':
        // Our Favourites URL
        const favoritesParams = new URLSearchParams({
          broker_id: config.brokerId,
          token: token,
          expire: expiry.toString(),
          user: config.userId,
          locale: language === 'en' ? 'en-GB' : language,
          account_type: config.accountType
        });
        
        if (theme === 'dark') {
          favoritesParams.append('style', 'ds');
          favoritesParams.append('chart_style', 
            'AAz_AAAA_______MzMz_________________o1yi______-jXKL_YkKl______9iQqX______6Ncov______YkKl____________AAAA_xsCLv8kSiz_o1yi_7M8AAAJTS9kIEhIOm1tAAZkL00veXkACiMsIyMwLjAwMDAABUFyaWFs_wAA______________________8BAQH_SHax_2Sxiv__gEAAAAAAAAAAAAAAQCAAAABKaHR0cHM6Ly9icm9rZXJzbG9nb3MuYXV0b2NoYXJ0aXN0LmNvbS9jdXN0b20tY2hhcnRzL2RhcmstenVwZXJpb3ItbG9nby5wbmc-TMzNAA1NaWRkbGUgQ2VudGVyP4AAAAAAAAAAAAAAABBhdXRvY2hhcnRpc3QuY29t__-AQAAAAAEAAAAAAf__gED__4BA__-AQP8bAi4_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD5MzM0_gAAAAAAAAAAAAAAAAAAMAAAADAAAAAAAAAAAAAAAAA4AAAASAQ'
          );
        }
        url = `https://component.autochartist.com/of/?${favoritesParams.toString()}#/`;
        break;

      default:
        // Technical Analysis URL (default)
        const techParams = new URLSearchParams({
          broker_id: config.brokerId,
          token: token,
          expire: expiry.toString(),
          user: config.userId,
          locale: config.locale,
          layout: config.layout,
          account_type: config.accountType,
          trade_now: config.tradeNow,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        if (theme === 'dark') techParams.append('style', 'ds');
        url = `https://component.autochartist.com/to/?${techParams.toString()}#/results`;
    }

    return NextResponse.json({ url });

  } catch (error) {
    console.error('Autochartist token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Autochartist URL' },
      { status: 500 }
    );
  }
}