CREATE MIGRATION m1n5wcusszmwl5r6lstoluarokyd7ff7bcuynfywxm7usdhjtorztq
    ONTO m16vhgao2htumac5xn5c3kmtecrhau4sptg6jwhxdt22lpsumz4caq
{
  CREATE MODULE util IF NOT EXISTS;
  ALTER SCALAR TYPE default::Language RENAME TO util::Language;
};
