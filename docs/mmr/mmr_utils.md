
<a name="mmr_mmr_utils"></a>

# Module `mmr::mmr_utils`

Define core MMR computation logic, exposing functions for position indexing, peak resolution,
and proof construction used in Merkle Mountain Range operations.


-  [Struct `ProofPositions`](#mmr_mmr_utils_ProofPositions)
-  [Constants](#@Constants_0)
-  [Function `get_local_tree_path_hashes`](#mmr_mmr_utils_get_local_tree_path_hashes)
-  [Function `get_left_peaks_hashes`](#mmr_mmr_utils_get_left_peaks_hashes)
-  [Function `get_right_peaks_hashes`](#mmr_mmr_utils_get_right_peaks_hashes)
-  [Function `calc_proof_positions`](#mmr_mmr_utils_calc_proof_positions)
-  [Function `calc_proof_tree_path_positions`](#mmr_mmr_utils_calc_proof_tree_path_positions)
-  [Function `get_peaks_positions`](#mmr_mmr_utils_get_peaks_positions)
-  [Function `get_left_peaks_positions`](#mmr_mmr_utils_get_left_peaks_positions)
-  [Function `get_right_peaks_positions`](#mmr_mmr_utils_get_right_peaks_positions)
-  [Function `get_parent_position`](#mmr_mmr_utils_get_parent_position)
-  [Function `get_sibling_position`](#mmr_mmr_utils_get_sibling_position)
-  [Function `is_right_sibling`](#mmr_mmr_utils_is_right_sibling)
-  [Function `sibling_offset`](#mmr_mmr_utils_sibling_offset)
-  [Function `get_height`](#mmr_mmr_utils_get_height)
-  [Function `jump_left`](#mmr_mmr_utils_jump_left)
-  [Function `get_hashes_from_positions`](#mmr_mmr_utils_get_hashes_from_positions)
-  [Function `hash_with_integer`](#mmr_mmr_utils_hash_with_integer)


<pre><code><b>use</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits">mmr::mmr_bits</a>;
<b>use</b> <a href="../dependencies/std/ascii.md#std_ascii">std::ascii</a>;
<b>use</b> <a href="../dependencies/std/option.md#std_option">std::option</a>;
<b>use</b> <a href="../dependencies/std/string.md#std_string">std::string</a>;
<b>use</b> <a href="../dependencies/std/u64.md#std_u64">std::u64</a>;
<b>use</b> <a href="../dependencies/std/vector.md#std_vector">std::vector</a>;
<b>use</b> <a href="../dependencies/sui/hash.md#sui_hash">sui::hash</a>;
</code></pre>



<a name="mmr_mmr_utils_ProofPositions"></a>

## Struct `ProofPositions`

Hold all the positions needed for a proof. Used to organize the different parts of an MMR
inclusion proof.


<pre><code><b>public</b> <b>struct</b> <a href="#mmr_mmr_utils_ProofPositions">ProofPositions</a> <b>has</b> <b>copy</b>, drop
</code></pre>



<details>
<summary>Fields</summary>


<dl>
<dt>
<code>local_tree_path_positions: vector&lt;u64&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>left_peaks_positions: vector&lt;u64&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>right_peaks_positions: vector&lt;u64&gt;</code>
</dt>
<dd>
</dd>
</dl>


</details>

<a name="@Constants_0"></a>

## Constants


<a name="mmr_mmr_utils_EStartsAtOne"></a>

Attempting to access node 0


<pre><code>#[error]
<b>const</b> <a href="#mmr_mmr_utils_EStartsAtOne">EStartsAtOne</a>: vector&lt;u8&gt; = b"First position of a MMR node is 1";
</code></pre>



<a name="mmr_mmr_utils_get_local_tree_path_hashes"></a>

## Function `get_local_tree_path_hashes`

Return the hashes for the nodes in the local tree path.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_local_tree_path_hashes">get_local_tree_path_hashes</a>(proof_positions: &<a href="#mmr_mmr_utils_ProofPositions">mmr::mmr_utils::ProofPositions</a>, nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;vector&lt;u8&gt;&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_local_tree_path_hashes">get_local_tree_path_hashes</a>(proof_positions: &<a href="#mmr_mmr_utils_ProofPositions">ProofPositions</a>, nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;vector&lt;u8&gt;&gt; {
    <a href="#mmr_mmr_utils_get_hashes_from_positions">get_hashes_from_positions</a>(nodes_hashes, proof_positions.local_tree_path_positions)
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_left_peaks_hashes"></a>

## Function `get_left_peaks_hashes`

Return the hashes for peaks to the left of the element's peak.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_left_peaks_hashes">get_left_peaks_hashes</a>(proof_positions: &<a href="#mmr_mmr_utils_ProofPositions">mmr::mmr_utils::ProofPositions</a>, nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;vector&lt;u8&gt;&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_left_peaks_hashes">get_left_peaks_hashes</a>(proof_positions: &<a href="#mmr_mmr_utils_ProofPositions">ProofPositions</a>, nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;vector&lt;u8&gt;&gt; {
    <a href="#mmr_mmr_utils_get_hashes_from_positions">get_hashes_from_positions</a>(nodes_hashes, proof_positions.left_peaks_positions)
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_right_peaks_hashes"></a>

## Function `get_right_peaks_hashes`

Return the hashes for peaks to the right of the element's peak.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_right_peaks_hashes">get_right_peaks_hashes</a>(proof_positions: &<a href="#mmr_mmr_utils_ProofPositions">mmr::mmr_utils::ProofPositions</a>, nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;vector&lt;u8&gt;&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_right_peaks_hashes">get_right_peaks_hashes</a>(proof_positions: &<a href="#mmr_mmr_utils_ProofPositions">ProofPositions</a>, nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;vector&lt;u8&gt;&gt; {
    <a href="#mmr_mmr_utils_get_hashes_from_positions">get_hashes_from_positions</a>(nodes_hashes, proof_positions.right_peaks_positions)
}
</code></pre>



</details>

<a name="mmr_mmr_utils_calc_proof_positions"></a>

## Function `calc_proof_positions`

Calculate all positions needed for an inclusion proof, including the local path, and peaks to
the left and right.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_calc_proof_positions">calc_proof_positions</a>(position: u64, size: u64): <a href="#mmr_mmr_utils_ProofPositions">mmr::mmr_utils::ProofPositions</a>
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_calc_proof_positions">calc_proof_positions</a>(position: u64, size: u64): <a href="#mmr_mmr_utils_ProofPositions">ProofPositions</a> {
    // Get the local tree path positions
    <b>let</b> tree_path_positions = <a href="#mmr_mmr_utils_calc_proof_tree_path_positions">calc_proof_tree_path_positions</a>(position, size);
    // Peak position <b>for</b> the proof local tree is the parent of the last position in path <b>if</b>
    // the proof isn't <b>for</b> a leaf node
    <b>let</b> path_peak_position: u64;
    <b>if</b> (tree_path_positions.length() != 0) {
        path_peak_position = <a href="#mmr_mmr_utils_get_parent_position">get_parent_position</a>(tree_path_positions[tree_path_positions.length() - 1]);
    } <b>else</b> {
        // If is a leaf node the tree path will be empty and the peak will be itself
        path_peak_position = position;
    };
    // Get all peaks in the MMR
    <b>let</b> peaks_positions = <a href="#mmr_mmr_utils_get_peaks_positions">get_peaks_positions</a>(size);
    <b>let</b> <b>mut</b> left_peaks_positions = vector::empty&lt;u64&gt;();
    <b>let</b> <b>mut</b> right_peaks_positions = vector::empty&lt;u64&gt;();
    // If MMR is not a perfect binary tree or an empty tree
    <b>if</b> (peaks_positions.length() &gt; 1) {
        // Collect peaks to the left of the element's peak
        left_peaks_positions = <a href="#mmr_mmr_utils_get_left_peaks_positions">get_left_peaks_positions</a>(path_peak_position, peaks_positions);
        // Collect peaks to the right of the element's peak
        right_peaks_positions = <a href="#mmr_mmr_utils_get_right_peaks_positions">get_right_peaks_positions</a>(path_peak_position, peaks_positions);
    };
    <a href="#mmr_mmr_utils_ProofPositions">ProofPositions</a> {
        local_tree_path_positions: tree_path_positions,
        left_peaks_positions: left_peaks_positions,
        right_peaks_positions: right_peaks_positions,
    }
}
</code></pre>



</details>

<a name="mmr_mmr_utils_calc_proof_tree_path_positions"></a>

## Function `calc_proof_tree_path_positions`

Calculate the proof path (node positions) to his local tree peak in a MMR.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_calc_proof_tree_path_positions">calc_proof_tree_path_positions</a>(proof_position: u64, size: u64): vector&lt;u64&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_calc_proof_tree_path_positions">calc_proof_tree_path_positions</a>(proof_position: u64, size: u64): vector&lt;u64&gt; {
    <b>let</b> <b>mut</b> path_positions = vector::empty&lt;u64&gt;();
    <b>let</b> <b>mut</b> current_node_position: u64;
    <b>let</b> <b>mut</b> sibling_position: u64;
    // Handle special case when position is last node (leaf-peak)
    <b>if</b> (proof_position != size) {
        // navigate the binary tree from the leaf to the peak, storing each node that would be
        // necessary to calculate the peak hash
        current_node_position = proof_position;
        <b>while</b> (current_node_position &lt;= size) {
            // store the sibling position we need <b>for</b> computing the next level node
            sibling_position = <a href="#mmr_mmr_utils_get_sibling_position">get_sibling_position</a>(current_node_position);
            path_positions.push_back(sibling_position);
            // calculate the parent node position <b>for</b> the next iteration
            current_node_position = <a href="#mmr_mmr_utils_get_parent_position">get_parent_position</a>(current_node_position);
        };
        // Algorithm always stores one more node than necessary so we need to trim it
        path_positions.pop_back();
    };
    path_positions
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_peaks_positions"></a>

## Function `get_peaks_positions`

Calculate all peak positions in an MMR of a given size.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_peaks_positions">get_peaks_positions</a>(size: u64): vector&lt;u64&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_peaks_positions">get_peaks_positions</a>(size: u64): vector&lt;u64&gt; {
    <b>let</b> <b>mut</b> peaks_positions: vector&lt;u64&gt; = vector::empty&lt;u64&gt;();
    // Empty MMR <b>has</b> no peaks
    <b>if</b> (size == 0) { <b>return</b> peaks_positions };
    // Check <b>if</b> the MMR is a perfect binary tree so the size is the position of the only peak
    <b>if</b> (<a href="../mmr/mmr_bits.md#mmr_mmr_bits_are_all_ones">mmr_bits::are_all_ones</a>(size)) {
        peaks_positions.push_back(size);
    } <b>else</b> {
        // If the MMR is multi tree, calculate the height of the largest perfect binary tree
        // that can fit a MMR of this size
        <b>let</b> largest_tree_height = <a href="../mmr/mmr_bits.md#mmr_mmr_bits_get_length">mmr_bits::get_length</a>(size) - 1;
        // Use the height to calculate the largest, and therefor leftmost, tree size
        <b>let</b> <b>mut</b> tree_size = (<a href="../mmr/mmr_bits.md#mmr_mmr_bits_get_length">mmr_bits::get_length</a>((largest_tree_height <b>as</b> u64)) <b>as</b> u64);
        // Iterate over all perfect trees inside the MMR, storing how many nodes are outside the
        // tree we store the peak position on each iteration
        <b>let</b> <b>mut</b> nodes_left = size;
        <b>let</b> <b>mut</b> peak_position = 0;
        <b>while</b> (tree_size != 0) {
            // If the amount of nodes left to check is smaller than the tree size, that means
            // that that peak is not in the MMR and we just need to get the next smaller tree
            <b>if</b> (nodes_left &gt;= tree_size) {
                nodes_left = nodes_left - tree_size;
                peak_position = peak_position + tree_size;
                // Peaks positions are stored from left to right
                peaks_positions.push_back(peak_position);
            };
            // Calculate the next smaller perfect binary tree size
            tree_size = tree_size &gt;&gt; 1;
        };
    };
    peaks_positions
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_left_peaks_positions"></a>

## Function `get_left_peaks_positions`

Collect positions of peaks to the left of a given peak.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_left_peaks_positions">get_left_peaks_positions</a>(peak_position: u64, peaks_positions: vector&lt;u64&gt;): vector&lt;u64&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_left_peaks_positions">get_left_peaks_positions</a>(peak_position: u64, peaks_positions: vector&lt;u64&gt;): vector&lt;u64&gt; {
    <b>let</b> <b>mut</b> left_peaks_positions = vector::empty&lt;u64&gt;();
    <b>let</b> <b>mut</b> i = 0;
    <b>while</b> (i &lt; peaks_positions.length()) {
        <b>if</b> (peaks_positions[i] &lt; peak_position){
            left_peaks_positions.push_back(peaks_positions[i]);
        };
        i = i + 1;
    };
    left_peaks_positions
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_right_peaks_positions"></a>

## Function `get_right_peaks_positions`

Collect positions of peaks to the right of a given peak.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_right_peaks_positions">get_right_peaks_positions</a>(peak_position: u64, peaks_positions: vector&lt;u64&gt;): vector&lt;u64&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_right_peaks_positions">get_right_peaks_positions</a>(peak_position: u64, peaks_positions: vector&lt;u64&gt;): vector&lt;u64&gt; {
    <b>let</b> <b>mut</b> right_peaks_positions = vector::empty&lt;u64&gt;();
    <b>let</b> <b>mut</b> i = 0;
    <b>while</b> (i &lt; peaks_positions.length()) {
        <b>if</b> (peaks_positions[i] &gt; peak_position){
            right_peaks_positions.push_back(peaks_positions[i]);
        };
        i = i + 1;
    };
    right_peaks_positions
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_parent_position"></a>

## Function `get_parent_position`

Calculate the position of a node's parent in the MMR.
In a Merkle Mountain Range, each node (except for the peaks) has a parent.
This function determines the position of the parent node by:
1. Checking if the node is a right or left sibling using isRightSibling().
2. For right siblings, the parent is at position + 1.
3. For left siblings, the parent is at the right sibling's position + 1.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_parent_position">get_parent_position</a>(position: u64): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_parent_position">get_parent_position</a>(position: u64): u64 {
    <b>let</b> parent_position: u64;
    <b>if</b> (<a href="#mmr_mmr_utils_is_right_sibling">is_right_sibling</a>(position)) {
        parent_position = position + 1;
    } <b>else</b> {
        parent_position = <a href="#mmr_mmr_utils_get_sibling_position">get_sibling_position</a>(position) + 1;
    };
    parent_position
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_sibling_position"></a>

## Function `get_sibling_position`

Calculate the position of a node's sibling in the MMR.
In a Merkle Mountain Range, each node (except peaks) has a sibling. This function
determines the position of the sibling for a given node by:
1. Checking if the node is a right or left sibling using isRightSibling().
2. Calculating the appropriate offset based on the node's height.
3. Adding or subtracting the offset depending on whether the node is a left or right sibling.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_sibling_position">get_sibling_position</a>(position: u64): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_sibling_position">get_sibling_position</a>(position: u64): u64 {
    <b>let</b> sibling_position: u64;
    <b>if</b> (<a href="#mmr_mmr_utils_is_right_sibling">is_right_sibling</a>(position)) {
        sibling_position = position - <a href="#mmr_mmr_utils_sibling_offset">sibling_offset</a>(<a href="#mmr_mmr_utils_get_height">get_height</a>(position));
    } <b>else</b> {
        sibling_position = position + <a href="#mmr_mmr_utils_sibling_offset">sibling_offset</a>(<a href="#mmr_mmr_utils_get_height">get_height</a>(position));
    };
    sibling_position
}
</code></pre>



</details>

<a name="mmr_mmr_utils_is_right_sibling"></a>

## Function `is_right_sibling`

Determine if a node is a right sibling in the MMR.
This function checks if a node at the given position is a right sibling by getting the
sibling offset at the node height and comparing that height with the height of the node on
position plus offset.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_is_right_sibling">is_right_sibling</a>(position: u64): bool
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_is_right_sibling">is_right_sibling</a>(position: u64): bool {
    // Ensure position is a valid MMR node
    <b>assert</b>!(position &gt; 0, <a href="#mmr_mmr_utils_EStartsAtOne">EStartsAtOne</a>);
    // If the node is at the same height <b>as</b> the node on position + offset, its a left node
    <b>let</b> height = <a href="#mmr_mmr_utils_get_height">get_height</a>(position);
    <b>let</b> <a href="#mmr_mmr_utils_sibling_offset">sibling_offset</a> = <a href="#mmr_mmr_utils_sibling_offset">sibling_offset</a>(height);
    <b>if</b> (height == <a href="#mmr_mmr_utils_get_height">get_height</a>(position + <a href="#mmr_mmr_utils_sibling_offset">sibling_offset</a>)) {
        <b>return</b> <b>false</b>
    } <b>else</b> {
        <b>return</b> <b>true</b>
    }
}
</code></pre>



</details>

<a name="mmr_mmr_utils_sibling_offset"></a>

## Function `sibling_offset`

Calculate the offset to find a sibling node at a given height.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_sibling_offset">sibling_offset</a>(height: u8): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_sibling_offset">sibling_offset</a>(height: u8): u64 {
    <a href="../mmr/mmr_bits.md#mmr_mmr_bits_create_all_ones">mmr_bits::create_all_ones</a>(height)
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_height"></a>

## Function `get_height`

Get the height of a node given its position.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_height">get_height</a>(position: u64): u8
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_height">get_height</a>(position: u64): u8 {
    // We are looking <b>for</b> the leftmost node at the node level, we start our search from the position itself
    <b>let</b> <b>mut</b> left_most_node = position;
    // Leftmost nodes bit representation have all their bits set to one, <b>if</b> the current isn't
    // jump to the next* node on the left
    <b>while</b> (!<a href="../mmr/mmr_bits.md#mmr_mmr_bits_are_all_ones">mmr_bits::are_all_ones</a>(left_most_node)) {
        left_most_node = <a href="#mmr_mmr_utils_jump_left">jump_left</a>(left_most_node)
    };
    // The height of a level can be obtained by getting the length of the binary representation
    // of the leftmost node of that level, e.g. 7(111), length 3, height 3
    <a href="../mmr/mmr_bits.md#mmr_mmr_bits_get_length">mmr_bits::get_length</a>(left_most_node)
}
</code></pre>



</details>

<a name="mmr_mmr_utils_jump_left"></a>

## Function `jump_left`

Navigate leftward in the MMR tree structure by removing the rightmost 1 bit and trailing zeros
This function is used to traverse the MMR structure horizontally at the same height level.
When called on a node position, it returns the position of another node to the left
that is at the same height in the tree structure.

The implementation works by:
1. Finding the most significant bit (MSB) of the position.
2. Removing all bits to the right of the MSB (by subtracting them).
When called recursively, this function can be used to navigate to the leftmost node
at the same height level, which is useful for determining node properties in the MMR.
For example:
- For position 6 (binary 110), the MSB is at position 2 (value 4), and jumpLeft returns 4
- For position 11 (binary 1011), the MSB is at position 3 (value 8), and jumpLeft returns 8


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_jump_left">jump_left</a>(position: u64): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_jump_left">jump_left</a> (position: u64): u64 {
    // Find the most significant bit position
    <b>let</b> most_significant_bit: u64 = 1 &lt;&lt; (<a href="../mmr/mmr_bits.md#mmr_mmr_bits_get_length">mmr_bits::get_length</a>(position) - 1);
    // Subtract all bits to the right of the MSB
    position - (most_significant_bit - 1)
}
</code></pre>



</details>

<a name="mmr_mmr_utils_get_hashes_from_positions"></a>

## Function `get_hashes_from_positions`

Extract a subset of hashes at certain positions.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_hashes_from_positions">get_hashes_from_positions</a>(nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;, positions: vector&lt;u64&gt;): vector&lt;vector&lt;u8&gt;&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_get_hashes_from_positions">get_hashes_from_positions</a>(nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;, positions: vector&lt;u64&gt;): vector&lt;vector&lt;u8&gt;&gt; {
    <b>let</b> <b>mut</b> hashes = vector::empty&lt;vector&lt;u8&gt;&gt;();
    <b>let</b> <b>mut</b> i = 0;
    <b>while</b> (i &lt; positions.length()) {
        hashes.push_back(nodes_hashes[positions[i] - 1]);
        i = i + 1;
    };
    hashes
}
</code></pre>



</details>

<a name="mmr_mmr_utils_hash_with_integer"></a>

## Function `hash_with_integer`

Combine multiple hashes with an integer and hash the result.
This is used for creating a new leaf node by hashing its data with its position, a parent
node by hashing its child nodes along its position and for calculating the root bagging all
the peaks on the MMR together with the MMR size.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_hash_with_integer">hash_with_integer</a>(number: u64, hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;u8&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_utils_hash_with_integer">hash_with_integer</a>(number: u64, hashes: vector&lt;vector&lt;u8&gt;&gt;): vector&lt;u8&gt; {
    // Concatenate all hashes together
    <b>let</b> <b>mut</b> chain: vector&lt;u8&gt; = vector::empty&lt;u8&gt;();
    chain.append(number.to_string().into_bytes());
    <b>let</b> <b>mut</b> i = 0;
    <b>while</b> (i &lt; hashes.length()) {
        chain.append(hashes[i]);
        i = i + 1;
    };
    hash::blake2b256(&chain)
}
</code></pre>



</details>
