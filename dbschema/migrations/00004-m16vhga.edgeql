CREATE MIGRATION m16vhgao2htumac5xn5c3kmtecrhau4sptg6jwhxdt22lpsumz4caq
    ONTO m1apvonavtbpxbcr4wbqlhi5sgvltm6m4zpql766i33rz55kj7mjea
{
  ALTER TYPE default::Release {
      CREATE PROPERTY catalog_num: std::str;
      CREATE PROPERTY credit_name: std::str;
  };
  CREATE SCALAR TYPE default::Language EXTENDING enum<English, Chinese, Japanese>;
  ALTER TYPE default::Release {
      CREATE MULTI PROPERTY language: default::Language;
  };
};
