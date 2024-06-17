CREATE MIGRATION m1o6gcg6aduooylwe5ufyqmechv4q6ryle2nt5nzx7dqahjyz7maga
    ONTO m1vgefdvyjthmn43vapzty7sel7gsokrksc637by3ngp3jbcmrgb3q
{
  CREATE MODULE Artist IF NOT EXISTS;
  CREATE MODULE Release IF NOT EXISTS;
  CREATE MODULE Song IF NOT EXISTS;
  CREATE MODULE Util IF NOT EXISTS;
  ALTER TYPE default::Artist {
      DROP LINK release;
  };
  ALTER TYPE default::Release {
      DROP LINK artist;
  };
  ALTER TYPE default::Artist {
      DROP LINK song;
  };
  ALTER TYPE default::Song {
      DROP LINK artist;
  };
  ALTER TYPE default::Artist RENAME TO Artist::Artist;
  ALTER TYPE Artist::Artist {
      CREATE MULTI LINK members: Artist::Artist {
          CREATE PROPERTY join_year: std::int16;
          CREATE PROPERTY leave_year: std::int16;
      };
      CREATE MULTI LINK member_of := (.<members[IS Artist::Artist]);
  };
  ALTER TYPE default::Release RENAME TO Release::Release;
  ALTER TYPE Release::Release {
      CREATE REQUIRED MULTI LINK artist: Artist::Artist {
          SET REQUIRED USING (<Artist::Artist>{});
      };
  };
  ALTER TYPE Artist::Artist {
      CREATE MULTI LINK release := (.<artist[IS Release::Release]);
  };
  ALTER TYPE default::Song RENAME TO Song::Song;
  ALTER TYPE Song::Song {
      CREATE REQUIRED MULTI LINK artist: Artist::Artist {
          SET REQUIRED USING (<Artist::Artist>{});
      };
  };
  ALTER TYPE Artist::Artist {
      CREATE MULTI LINK song := (.<artist[IS Song::Song]);
  };
  ALTER SCALAR TYPE util::Language RENAME TO Util::Language;
  ALTER TYPE Song::Song {
      CREATE PROPERTY language: Util::Language;
  };
  ALTER SCALAR TYPE default::ArtistType RENAME TO Artist::ArtistType;
  DROP MODULE util;
};
