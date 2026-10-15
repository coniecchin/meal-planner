import type { Request, Response } from 'express';

export async function handleTheMealDBFilter(req: Request, res: Response) {
  try {
    // Read API key from environment variable; do not hardcode secrets
    const apiKey = process.env.THEMEALDB_API_KEY || process.env.MEALDB_API_KEY || '1';
    const ingredient = (req.query.i as string) || 'chicken_breast';

    const url = `https://www.themealdb.com/api/json/v1/${encodeURIComponent(apiKey)}/filter.php?i=${encodeURIComponent(ingredient)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch from TheMealDB: HTTP ${response.status}`,
        status: response.status,
      });
    }

    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Internal Server Error while connecting to TheMealDB',
      message: error?.message || String(error),
    });
  }
}

export default handleTheMealDBFilter;
