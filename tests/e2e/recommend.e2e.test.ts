import { fetchItemSimilarityRecommendations } from '../../src/app/services/recommend/get-item-similarity-recommendation';

describe('fetchItemSimilarityRecommendations E2E - /recommend/content/', () => {
  jest.setTimeout(10000); // allow 10s for API response

  it('should return an array of recommended movies for a valid query', async () => {
    const title = 'Toy Story (1995)';
    const numberOfRecommendations = 5;

    const results = await fetchItemSimilarityRecommendations(title, numberOfRecommendations);

    // Check that results is an array
    expect(Array.isArray(results)).toBe(true);

    // Check that length does not exceed requested number
    expect(results!.length).toBeLessThanOrEqual(numberOfRecommendations);

    // Check that at least one result is a string
    expect(results!.some(r => typeof r === 'string')).toBe(true);
  });

  it('should handle empty query gracefully', async () => {
    await expect(fetchItemSimilarityRecommendations('', 5)).rejects.toThrow();
  });

  it('should handle invalid number of recommendations', async () => {
    // @ts-ignore testing invalid input
    await expect(fetchItemSimilarityRecommendations('Toy Story', -3)).rejects.toThrow();
  });
});
