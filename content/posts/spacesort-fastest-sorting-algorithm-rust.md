---
title: 'I Tried to Make the Fastest Sorting Algorithm I Could Think Of... in Rust'
date: 2020-12-11T00:00:00Z
draft: false
tags:
  - rust
  - sorting
  - algorithms
  - projects
categories:
  - notes
---

## The story behind my latest project [s p a c e s o r t](https://github.com/DanielVZ96/spacesort)

![Gravitational lensing captured by the Hubble telescope.](/images/hubble-750x750.png)

Gravitational lensing captured by the Hubble telescope. [Source...](https://www.nasa.gov/feature/goddard/2019/hubble-captures-a-dozen-galaxy-doppelgangers)

As usual, it all started with a showerthought. "What's the *fastest* sorting algorithm I can come up with?".
Being someone who didn't study software engineering formally, I'm pretty ignorant about data structures and algorithms. I've only read one book about it and I have to admit I read it as fast as posible.
But I'm also someone who spends a lot of time in his head, a day-dreamer if you will. My day dreaming specializes in thinking about stuff I don't know jack about. And for that sole reason I've been day dreaming about sorting algorithms for quite some months now. So it was only a matter of time I would challenge myself like that in the shower. Why not? It would be fun to come up with something and then compare it to "real" sorting algorithms.

There was one more reason behind this challenge. I'm currently learning rust. At the time of writing, I'm at chapter 16 of the [rust book](https://doc.rust-lang.org/book/). I wanted to establish what I had learned by doing some crazy project. Plus, coming from python, the whole idea of memory management was pretty alien for me. Despite this I found the ownership system pretty intuitive compared with what I had to face when I learned C (multiple memory allocation methods and pitfalls). So I also wanted to try the whole memory management stuff in a real life problem. And that's when the idea struck me: my sorting algorithm will leverage memory (*s p a c e*) in order to sort faster.

Almost all the sorting algorithms I remember sorted using comparisons. I knew there were other methods like radix sort but I didn't understand it and the name sounded pretty complex to me. So during that shower I came up with the fastest solution I could think of that avoids comparisons:

```rust
// My first attempt at sorting.
pub fn sort_v1(v: Vec<usize>) -> Vec<usize> {
    let sum: usize = v.iter().sum();
    // Create an index vector filled with None with the length of the sum of the values.
    let mut index: Vec<Option <usize>> = vec![None; sum];

    // Iter the input vector and put each number in it's index of the index vector.
    for i in v.iter() {
        index[*i as usize] = Some(*i);
    }
    index
        .iter()
        .filter(|x| x.is_some())  // Filter out None values
        .map(|x| x.unwrap())      // Extract values from Option
        .collect()
}
```

![First try at sorting benchmark.](/images/benchmarks/sort_v1_small_range.svg)

First try at sorting benchmark. Note that I could only go up to 100 elements; my algorithm was too slow to benchmark it in a reasonable time.

Well... that looked a lot better in my head. This method is pretty slow. Very slow. Unnecesarily slow. Still, it was something and it was mine. My train of thought was "numbers already *encode* where they belong". Therefore if we allocate a vector with sufficient size (for some reason I thought I needed the SUM of the values), we'll just have to put each value where it belongs and get rid of all of the space in between. Then, by not caring about space complexity my algorithm would have better time complexity. This is similar to another algorithm: [counting sort](https://en.wikipedia.org/wiki/Counting_sort), but at the time I didn't even remember reading about it.

So... regarding what's wrong with this algorithm. Let's fix it. The most obvious fix is to replace the `.iter().sum()` to just `.max()`. I don't know why I thought I needed the sum of the vector, but it's pretty obvious that, if I'm indexing by the values contained in the vector, the length of the `index` vector will be the maximum value in the input vector. Second, it seems unnecesary to save the value in the index vector if we already encode the value in its index. It makes a more sense to replace the `Option` with a `bool`, as we only need to encode the presence of a value in a certain index. The result is the following function:

```rust
// Second attempt at fast sorting
pub fn sort_v2(v: Vec<usize>) -> Vec<usize> {
    let max = v.iter().max().unwrap();

    // Create the index vector with `max` length
    let mut index: Vec<bool> = vec![false; max + 1];

    for i in v.iter() {
        index[*i] = true;
    }

    return index
        .into_iter()
        .enumerate()
        .filter(|(_, x)| *x)  // Filter out false values
        .map(|(i, _)| i)      // Collect index values
        .collect();
}
```

![My second attempt at sorting, small range.](/images/benchmarks/sort_v2_small_range.svg)

My second attempt at sorting. Pretty fast for small ranges of values (between 0 and 1.000). Please note that the scale is logarithmic in both scales in order to be able to see both small and big differences of speed.

This version is better and faster. It's faster than all algorithms I benchmarked against it in lists consisting in a small range of values and bigger than about 100 elements. But there are two caveats here. First, he complexity of the algorithm is `O(n + max)`. It heavily depends on how big is the max value:

![My second attempt at sorting, medium range.](/images/benchmarks/sort_v2_med_range.svg)

My second attempt at sorting. Sometimes fast for medium ranges of values (between 0 and 1.000.000).

![My second attempt at sorting, max range.](/images/benchmarks/sort_v2_max_range.svg)

My second attempt at sorting. Slow for large ranges of values (between 0 and 100.000.000).

I'm fully aware that "small", "medium", and "large" are kinda subjective here. I'd prefer to benchmark continuosly in both dimensions and plot a heatmap, but I haven't had the time to leave my computer running these simulations for so long. Still, the intuition of how this algorithm scales is clear. For very large vectors, the only limit is the ammount of ram available.

The second and bigger caveat of this algorithm is that it doesn't keep duplicates, it overwrites `true` one on top of the other in the `index` vector. So let's try to make a "fair" version of this algorithm:

```rust
pub fn sort_v2_fair(v: Vec<usize>) -> Vec<usize> {
    let min: usize = *v.iter().min().unwrap();
    // Use max - min to shift all values to zero
    // hopefully reducing the index length
    let max: usize = v.iter().max().unwrap() - min;
    let mut index: Vec<usize> = vec![0; max + 1];

    // Count how many duplicates are in a given index
    for i in v.iter() {
        index[i - min] += 1;
    }
    return index
        .iter()
        .filter(|x| **x != 0)  // Filter zeroes
        .enumerate()
        .map(|(i, c)| vec![i + min; *c])  // Build vectors of duplicates
        .flatten()
        .collect();
}
```

![My fair attempt at sorting, max range.](/images/benchmarks/sort_v2_fair_max_range.svg)
![My fair attempt at sorting, medium range.](/images/benchmarks/sort_v2_fair_med_range.svg)
![My fair attempt at sorting, small range.](/images/benchmarks/sort_v2_fair_small_range.svg)

My fair attempt at sorting.

Now it's fast for sizes larger than 1k in small ranges. In medium and large ranges it's only fast for sizes larger than 10 million while ram lasts. It's a lot worse than I think it should be but I still have some tricks up my sleve. First, we can check if there's a duplicate in order to determine if we can use the unfair version of the algorithm, which we'll call "setsort" for now, because the word "unfair" is a bit mean >:( So given the length and range of values of a list we can estimate if and how probable it is for it to be a set and then get to a probability for which it is acceptable to check for duplicates and use setsort.

Second, I'm going to break my rule of only using what I can come up with and peak behind other non-comparative sorting algorithms. I'm ready to compare what I can come up with the "real" algos. The one that got my attention was counting sort because it is fast and is somewhat similar to what I'm doing here. My key takeaway from it is instead of building vectors of repeated values, we just store all values in the result array and increment the indexing key we use each time we add a new value. Here's some pseudocode of it I [found in wikipedia](https://en.wikipedia.org/wiki/Counting_sort#The_algorithm):

```text
count = array of k+1 zeros
for x in input do
    count[key(x)] += 1

total = 0
for i in 0, 1, ... k do
    count[i], total = total, count[i] + total

output = array of the same length as input
for x in input do
    output[count[key(x)]] = x
    count[key(x)] += 1

return output
```

Finally the last trick I'll use is using other algorithms depending on the length and range of values in a list. This goes against the whole "coming up with it by myself" idea, but at this point I just want to go fast. Plus, technically I'm still coming up with these "ideas" and bringing parts of my original attempt to the equation. So, given that at the "small" range the fair algorithm is faster from around 1k elements, 5 million at the "med" range, and probably 1 billion at the "max" range (discarding radix sort), and by fitting a quadratic curve at [wolframalpha](https://www.wolframalpha.com/input/?i=quadratic+fit+%7B%7B150%2C+1000%7D%2C+%7B1000%2C+10000%7D%2C+%7B1000000%2C+10000000%7D%2C+%7B4000000%2C+50000000%7D%7D), we get that the equation that determines whether my algorithm will be faster is roughly `y = (8.3339 * 10⁻⁷)x² - 9.16638x + 228.583`, where `x` is the length of the list and `y` is the range of values in it. Therefore, for a given list length, if the range of the list is more than `y`, I should use another algorithm.

Which other algorithm? From the plots we can see that in larger lists radix is faster and in the smaller ones quickersort is faster (which, from what I read on [their create](https://docs.rs/crate/quickersort/3.0.1) uses a mixture of insertion sort, dual pivot quicksort and heapsort). So using the same magic fitting method we used with my own algorithm we get the following super formula: `x = 5000`. We need no magic formulas. Judging by what the graphs show, the length at which radix starts being faster is always 5000. We'll set that for cases in which my sorting algorithm is too slow and lengths lower than 5k elements, we'll use quickersort... for now :) And we finally have the fastest algorithm I could come up with! (WIP, # TODO write algorithm)

```rust
fn should_use_space(len: f64, range: f64) -> bool {
    return range >= ((8.3339 * f64::from(10).powi(-7)) * len.powi(2)) - 9.16638 * len + 228.583;
}

pub fn space_sort<T: SpaceSortable>(v: Vec<T>) -> Vec<T> {
    let len = v.len();
    if len < 200 {
        let mut r: Vec<T> = v.clone();
        quickersort::sort(&mut r);
        return r;
    }

    let max = v.iter().max().unwrap().to_i64().unwrap();
    let min = v.iter().min().unwrap().to_i64().unwrap();
    let range = max - min;
    let settability_index = 1 - (range / len as i64);
    let mut is_set = false;
    if should_use_space(len as f64, range as f64) {
        if settability_index > MIN_HAS_DUP_SETTABILITY {
            is_set = !has_dup(&v);
        }

        if is_set {
            return space_sort_set(v, range);
        }
        if max - min > MIN_RANGE_DERANGE || min < 0 {
            return space_sort_not_set_deranged(v, len, min, max);
        } else {
            return space_sort_not_set(v, len, min, max);
        }
    }
    if len < 5000 {
        let mut r: Vec<T> = v.clone();
        quickersort::sort(&mut r);
        return r;
    } else {
        let mut r: Vec<T> = v.clone();
        r.rdxsort();
        return r;
    }
}
```

So this is THE fastest sorting algorithm I could come up with. I won't put benchmarks because it isn't working as intended :P The `should_use_space` function is always returning false. Plus there is still some further work I'd like to do, like testing a custom data structure for retrying the idea of reducing space between lists. I should also run a more continuous benchmark to better fit the decision courve, maybe that can help me fix the `should_use_space` function. I've already implemented the ability of sorting by a custom function that returns a "SpaceSortable", but I think that implementation can be further optimized. But as time is a finite resource, I prefer to postpone all further work on this until I finish reading the rust book. For now, I'll just leave my current ideas in the repo's readme. This is a learning project of mine, so I'd be grateful for any suggestion and correction you may have about it. You can [open an issue at the repo](https://github.com/DanielVZ96/spacesort), hit me up on twitter, or talk to me directly if you have the means :)
