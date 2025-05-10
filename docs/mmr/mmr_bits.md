
<a name="mmr_mmr_bits"></a>

# Module `mmr::mmr_bits`

Provide helper functions for doing bitwise operations needed for handling the MMR.


-  [Constants](#@Constants_0)
-  [Function `get_length`](#mmr_mmr_bits_get_length)
-  [Function `count_ones`](#mmr_mmr_bits_count_ones)
-  [Function `are_all_ones`](#mmr_mmr_bits_are_all_ones)
-  [Function `create_all_ones`](#mmr_mmr_bits_create_all_ones)


<pre><code></code></pre>



<a name="@Constants_0"></a>

## Constants


<a name="mmr_mmr_bits_Eu64Length"></a>

Trying to create a u64 longer than 64 bits


<pre><code>#[error]
<b>const</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_Eu64Length">Eu64Length</a>: vector&lt;u8&gt; = b"Bit length must be less than or equal to 64";
</code></pre>



<a name="mmr_mmr_bits_get_length"></a>

## Function `get_length`

Calculate the minimum number of bits needed to represent a number.

This function computes the position of the most significant bit that is set to 1.
For example, for 13 (1101 in binary), the function returns 4 since the highest set bit is in
position 4.
For 0, it returns 0 as a special case since no bits are needed to represent zero.
This is useful in MMR operations to determine tree heights and positions.


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_get_length">get_length</a>(num: u64): u8
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_get_length">get_length</a>(num: u64): u8 {
    <b>if</b> (num == 0) {
        <b>return</b> 0
    };
    <b>let</b> <b>mut</b> x = num;
    <b>let</b> <b>mut</b> count: u8 = 0;
    // Count how many right shifts are needed until the number becomes 0
    <b>while</b> (x &gt; 0) {
        count = count + 1;
        x = x &gt;&gt; 1;
    };
    count
}
</code></pre>



</details>

<a name="mmr_mmr_bits_count_ones"></a>

## Function `count_ones`

Count the number of 1 bits in the binary representation of a number.

This function determines the number of set bits (1s) in the binary representation.
It uses Brian Kernighan's algorithm which iteratively removes the least significant set bit.
For example, for 13 (1101 in binary), the function returns 3 as there are three 1s.
In MMR operations, this can be used to count the number of elements in certain paths or structures.


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_count_ones">count_ones</a>(num: u64): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_count_ones">count_ones</a>(num: u64): u64 {
    <b>let</b> <b>mut</b> count: u64 = 0;
    <b>let</b> <b>mut</b> n = num;
    // Classic bit-counting algorithm: remove the lowest set bit in each iteration
    <b>while</b> (n != 0) {
        n = n & (n - 1);  // This removes the lowest set bit
        count = count + 1;
    };
    count
}
</code></pre>



</details>

<a name="mmr_mmr_bits_are_all_ones"></a>

## Function `are_all_ones`

Check if a number consists of all consecutive 1 bits from the least significant bit.

This function determines if a number has the form 2^n - 1, which in binary is a sequence
of n consecutive 1 bits (e.g., 7 = 111, 15 = 1111, 31 = 11111).
Such numbers represent perfect binary trees in the MMR structure.
The implementation uses a bitwise trick: for any number of form 2^n - 1,
performing (num & (num+1)) will always result in 0 because:
- num has all 1s in its lowest n bits.
- num+1 has a single 1 in position n+1 and all 0s in lower positions.
- Their bitwise AND will therefore be 0.


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_are_all_ones">are_all_ones</a>(num: u64): bool
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_are_all_ones">are_all_ones</a>(num: u64): bool {
    (num & (num + 1)) == 0
}
</code></pre>



</details>

<a name="mmr_mmr_bits_create_all_ones"></a>

## Function `create_all_ones`

Create a number with a specified number of least significant bits set to 1.

This function generates a number with exactly 'bitsLength' consecutive 1 bits starting from the LSB.
For example, with bitsLength=3, it returns 7 (111 in binary).
The result has the form 2^bitsLength - 1, which creates a value with the desired bit pattern.
These patterns are useful in MMR operations for creating masks or identifying perfect subtrees.
The function checks that the requested bit length doesn't exceed 64 (the size of u64).


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_create_all_ones">create_all_ones</a>(bitsLength: u8): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits_create_all_ones">create_all_ones</a>(bitsLength: u8): u64 {
    <b>assert</b>!(bitsLength &lt;= 64, <a href="../mmr/mmr_bits.md#mmr_mmr_bits_Eu64Length">Eu64Length</a>);
    // Calculate 2^bitsLength - 1, which <b>has</b> 'bitsLength' 1s
    (1 &lt;&lt; bitsLength) - 1
}
</code></pre>



</details>
