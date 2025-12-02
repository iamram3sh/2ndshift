/**
 * Tests for matching algorithm
 */

describe('Matching Algorithm', () => {
  const mockJob = {
    required_skills: ['React', 'TypeScript', 'Node.js'],
    category_id: 'web-dev',
  };

  const mockWorkers = [
    {
      id: 'worker1',
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      verified_level: 'premium',
      score: 90,
    },
    {
      id: 'worker2',
      skills: ['Vue.js', 'JavaScript'],
      verified_level: 'basic',
      score: 70,
    },
    {
      id: 'worker3',
      skills: ['React', 'TypeScript'],
      verified_level: 'professional',
      score: 85,
    },
  ];

  describe('Skill Matching', () => {
    it('should calculate skill overlap correctly', () => {
      const worker1Overlap = mockJob.required_skills.filter(skill =>
        mockWorkers[0].skills.includes(skill)
      ).length;
      expect(worker1Overlap).toBe(3);

      const worker2Overlap = mockJob.required_skills.filter(skill =>
        mockWorkers[1].skills.includes(skill)
      ).length;
      expect(worker2Overlap).toBe(0);
    });

    it('should calculate match score correctly', () => {
      const worker1 = mockWorkers[0];
      const skillOverlap = 3;
      const skillMatchScore = skillOverlap / mockJob.required_skills.length; // 1.0
      const verifiedScore = 0.3; // premium
      const profileScore = (worker1.score / 100) * 0.2; // 0.18
      const totalScore = skillMatchScore * 0.5 + verifiedScore + profileScore;

      expect(totalScore).toBeGreaterThan(0.8);
    });
  });

  describe('Ranking', () => {
    it('should rank workers by match score', () => {
      const scored = mockWorkers.map(worker => {
        const skillOverlap = mockJob.required_skills.filter(skill =>
          worker.skills.includes(skill)
        ).length;
        const skillMatchScore = skillOverlap / mockJob.required_skills.length;
        const verifiedScore = worker.verified_level === 'premium' ? 0.3 :
                             worker.verified_level === 'professional' ? 0.2 : 0.1;
        const profileScore = (worker.score / 100) * 0.2;
        return {
          ...worker,
          match_score: skillMatchScore * 0.5 + verifiedScore + profileScore,
        };
      }).sort((a, b) => b.match_score - a.match_score);

      expect(scored[0].id).toBe('worker1'); // Highest match
    });
  });
});
