using System;
using System.Linq;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class SpecificationEvaluator<T> where T : BaseEntity
{
    // PHIÊN BẢN 1: Dành cho truy vấn cơ bản (Chính là hàm GenericRepository đang cần)
    public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> spec)
    {
        if (spec.Criteria != null)
        {
            query = query.Where(spec.Criteria); // x => x.Brand == brand
        }

        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }
        else if (spec.OrderByDescending != null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        if (spec.IsDistinct)
        {
            query = query.Distinct();
        }
        return query;
    }

    // PHIÊN BẢN 2: Dành cho truy vấn có Select (Đoạn code cũ của bạn, giữ lại cho bài sau)
    public static IQueryable<TResult> GetQuery<TSpec, TResult>(IQueryable<T> query, ISpecification<T, TResult> spec)
    {
        if (spec.Criteria != null)
        {
            query = query.Where(spec.Criteria);
        }

        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }
        else if (spec.OrderByDescending != null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        var selectQuery = query as IQueryable<TResult>;

        if (spec.Select != null)
        {
            selectQuery = query.Select(spec.Select);
        }

        if (spec.IsDistinct)
        {
            selectQuery = selectQuery?.Distinct();
        }

        return selectQuery ?? query.Cast<TResult>();
    }
}