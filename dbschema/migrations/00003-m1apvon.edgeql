CREATE MIGRATION m1apvonavtbpxbcr4wbqlhi5sgvltm6m4zpql766i33rz55kj7mjea
    ONTO m1jerkhoaxbgesdrpsuao2yu2d2y7yvu5lc4hokwyvarmwzrc22tfa
{
  ALTER TYPE default::Artist {
      CREATE MULTI LINK alias: default::Artist;
  };
  CREATE SCALAR TYPE default::ArtistType EXTENDING enum<Person, `Group`>;
  ALTER TYPE default::Artist {
      CREATE REQUIRED PROPERTY artist_type: default::ArtistType {
          SET REQUIRED USING (<default::ArtistType>{default::ArtistType.Person});
      };
      CREATE MULTI PROPERTY text_alias: std::str;
  };
  CREATE TYPE default::Song {
      CREATE MULTI LINK artist: default::Artist;
      CREATE PROPERTY duration: std::duration;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY name: std::str;
  };
};
