CREATE MIGRATION m1t2ixv43r3vye2a3bobb53njp5jqx73btfoj2jux7vhvpx2kupy5a
    ONTO m1vd3wymwo776nkbk4wtoltosvsxwjv5xxyaddy4ys7riasg6u5hyq
{
  ALTER TYPE Artist::Artist {
      DROP LINK member_of;
  };
  ALTER TYPE Artist::Artist {
      DROP LINK release;
  };
  ALTER TYPE Artist::Artist {
      DROP LINK song;
  };
  ALTER TYPE Artist::Artist RENAME TO default::Artist;
  ALTER TYPE Release::Release RENAME TO default::Release;
  ALTER TYPE Song::Song RENAME TO default::Song;
  ALTER TYPE default::Artist {
      CREATE MULTI LINK member_of := (.<members[IS default::Artist]);
      CREATE MULTI LINK release := (.<artist[IS default::Release]);
      CREATE MULTI LINK song := (.<artist[IS default::Song]);
  };
  ALTER SCALAR TYPE Artist::ArtistType RENAME TO default::ArtistType;
  DROP MODULE Song;
  DROP MODULE Release;
  DROP MODULE Artist;
};
