
<a name="mmr_mmr"></a>

# Module `mmr::mmr`

MerkleMountainRange

This contract implements a Merkle Mountain Range (MMR) data structure, which is an efficient
append-only accumulator for cryptographic commitments. MMRs are a collection of perfect binary
trees arranged as a series of "peaks" that can be efficiently appended to and proven against.
It uses the MMRUtil to derive all the positions needed which it then handles for hash merging and peak bagging.

MMRs are particularly useful for lightweight clients, as they allow verifying the inclusion of
elements without needing to store the entire dataset.


-  [Struct `MMRShared`](#mmr_mmr_MMRShared)
-  [Struct `MMRUpdated`](#mmr_mmr_MMRUpdated)
-  [Struct `Proof`](#mmr_mmr_Proof)
-  [Struct `MMR`](#mmr_mmr_MMR)
-  [Constants](#@Constants_0)
-  [Function `get_position`](#mmr_mmr_get_position)
-  [Function `get_mmr_root`](#mmr_mmr_get_mmr_root)
-  [Function `get_mmr_size`](#mmr_mmr_get_mmr_size)
-  [Function `verify`](#mmr_mmr_verify)
-  [Function `new`](#mmr_mmr_new)
-  [Function `create_mmr`](#mmr_mmr_create_mmr)
-  [Function `create_public_mmr`](#mmr_mmr_create_public_mmr)
-  [Function `get_root`](#mmr_mmr_get_root)
-  [Function `get_peaks`](#mmr_mmr_get_peaks)
-  [Function `get_nodes`](#mmr_mmr_get_nodes)
-  [Function `get_size`](#mmr_mmr_get_size)
-  [Function `append_leaves`](#mmr_mmr_append_leaves)
-  [Function `append_leaf`](#mmr_mmr_append_leaf)
-  [Function `generate_proof`](#mmr_mmr_generate_proof)


<pre><code><b>use</b> <a href="../mmr/mmr_bits.md#mmr_mmr_bits">mmr::mmr_bits</a>;
<b>use</b> <a href="../mmr/mmr_utils.md#mmr_mmr_utils">mmr::mmr_utils</a>;
<b>use</b> <a href="../dependencies/std/ascii.md#std_ascii">std::ascii</a>;
<b>use</b> <a href="../dependencies/std/bcs.md#std_bcs">std::bcs</a>;
<b>use</b> <a href="../dependencies/std/option.md#std_option">std::option</a>;
<b>use</b> <a href="../dependencies/std/string.md#std_string">std::string</a>;
<b>use</b> <a href="../dependencies/std/u64.md#std_u64">std::u64</a>;
<b>use</b> <a href="../dependencies/std/vector.md#std_vector">std::vector</a>;
<b>use</b> <a href="../dependencies/sui/address.md#sui_address">sui::address</a>;
<b>use</b> <a href="../dependencies/sui/event.md#sui_event">sui::event</a>;
<b>use</b> <a href="../dependencies/sui/hash.md#sui_hash">sui::hash</a>;
<b>use</b> <a href="../dependencies/sui/hex.md#sui_hex">sui::hex</a>;
<b>use</b> <a href="../dependencies/sui/object.md#sui_object">sui::object</a>;
<b>use</b> <a href="../dependencies/sui/transfer.md#sui_transfer">sui::transfer</a>;
<b>use</b> <a href="../dependencies/sui/tx_context.md#sui_tx_context">sui::tx_context</a>;
</code></pre>



<a name="mmr_mmr_MMRShared"></a>

## Struct `MMRShared`

Event emitted when a public MMR is created.


<pre><code><b>public</b> <b>struct</b> <a href="#mmr_mmr_MMRShared">MMRShared</a> <b>has</b> <b>copy</b>, drop
</code></pre>



<details>
<summary>Fields</summary>


<dl>
<dt>
<code>creator: <b>address</b></code>
</dt>
<dd>
</dd>
<dt>
<code>id: <a href="../dependencies/sui/object.md#sui_object_ID">sui::object::ID</a></code>
</dt>
<dd>
</dd>
</dl>


</details>

<a name="mmr_mmr_MMRUpdated"></a>

## Struct `MMRUpdated`

Event emitted when the MMR root is updated.


<pre><code><b>public</b> <b>struct</b> <a href="#mmr_mmr_MMRUpdated">MMRUpdated</a> <b>has</b> <b>copy</b>, drop
</code></pre>



<details>
<summary>Fields</summary>


<dl>
<dt>
<code>root: vector&lt;u8&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>peaks: vector&lt;vector&lt;u8&gt;&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>new_size: u64</code>
</dt>
<dd>
</dd>
</dl>


</details>

<a name="mmr_mmr_Proof"></a>

## Struct `Proof`

Proof struct that contains all necessary data for verifying the inclusion
of an element in the MMR without needing the entire structure.

The proof includes:
- The position of the element in the MMR.
- Hashes from the local tree path (for verification up to the peak).
- Hashes from peaks to the left and right of the element's peak.
- The root hash for verification.
- The size of the MMR when the proof was generated.


<pre><code><b>public</b> <b>struct</b> <a href="#mmr_mmr_Proof">Proof</a> <b>has</b> <b>copy</b>, drop, store
</code></pre>



<details>
<summary>Fields</summary>


<dl>
<dt>
<code>position: u64</code>
</dt>
<dd>
</dd>
<dt>
<code>local_tree_path_hashes: vector&lt;vector&lt;u8&gt;&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>left_peaks_hashes: vector&lt;vector&lt;u8&gt;&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>right_peaks_hashes: vector&lt;vector&lt;u8&gt;&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>mmr_root: vector&lt;u8&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>mmr_size: u64</code>
</dt>
<dd>
</dd>
</dl>


</details>

<a name="mmr_mmr_MMR"></a>

## Struct `MMR`

MMR object that manages the appending of elements and generation of proofs.

This object maintains:
- The current root commitment.
- The current peaks of the MMR.
- All nodes in the MMR.


<pre><code><b>public</b> <b>struct</b> <a href="#mmr_mmr_MMR">MMR</a> <b>has</b> key, store
</code></pre>



<details>
<summary>Fields</summary>


<dl>
<dt>
<code>id: <a href="../dependencies/sui/object.md#sui_object_UID">sui::object::UID</a></code>
</dt>
<dd>
</dd>
<dt>
<code>root: vector&lt;u8&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>peaks_hashes: vector&lt;vector&lt;u8&gt;&gt;</code>
</dt>
<dd>
</dd>
<dt>
<code>nodes_hashes: vector&lt;vector&lt;u8&gt;&gt;</code>
</dt>
<dd>
</dd>
</dl>


</details>

<a name="@Constants_0"></a>

## Constants


<a name="mmr_mmr_EStartsAtOne"></a>

Attempting to access node 0.


<pre><code>#[error]
<b>const</b> <a href="#mmr_mmr_EStartsAtOne">EStartsAtOne</a>: vector&lt;u8&gt; = b"First position of a <a href="#mmr_mmr_MMR">MMR</a> node is 1";
</code></pre>



<a name="mmr_mmr_EProofOnlyLeaf"></a>

Attempting to generate a proof for a non-leaf node.


<pre><code>#[error]
<b>const</b> <a href="#mmr_mmr_EProofOnlyLeaf">EProofOnlyLeaf</a>: vector&lt;u8&gt; = b"Proofs can only be generated <b>for</b> lead nodes";
</code></pre>



<a name="mmr_mmr_ENonExistingNode"></a>

Attempting to access a node bigger than MMR size.


<pre><code>#[error]
<b>const</b> <a href="#mmr_mmr_ENonExistingNode">ENonExistingNode</a>: vector&lt;u8&gt; = b"Node does not exists";
</code></pre>



<a name="mmr_mmr_get_position"></a>

## Function `get_position`

Return the position of the element in the MMR that this proof is for.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_position">get_position</a>(proof: &<a href="#mmr_mmr_Proof">mmr::mmr::Proof</a>): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_position">get_position</a>(proof: &<a href="#mmr_mmr_Proof">Proof</a>): u64 {
    proof.position
}
</code></pre>



</details>

<a name="mmr_mmr_get_mmr_root"></a>

## Function `get_mmr_root`

Return the root hash of the MMR at the time this proof was generated.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_mmr_root">get_mmr_root</a>(proof: &<a href="#mmr_mmr_Proof">mmr::mmr::Proof</a>): vector&lt;u8&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_mmr_root">get_mmr_root</a>(proof: &<a href="#mmr_mmr_Proof">Proof</a>): vector&lt;u8&gt; {
    proof.mmr_root
}
</code></pre>



</details>

<a name="mmr_mmr_get_mmr_size"></a>

## Function `get_mmr_size`

Return the size of the MMR at the time this proof was generated.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_mmr_size">get_mmr_size</a>(proof: &<a href="#mmr_mmr_Proof">mmr::mmr::Proof</a>): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_mmr_size">get_mmr_size</a>(proof: &<a href="#mmr_mmr_Proof">Proof</a>): u64 {
    proof.mmr_size
}
</code></pre>



</details>

<a name="mmr_mmr_verify"></a>

## Function `verify`

Verify that some data exists in the MMR the proof belongs to.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_verify">verify</a>(proof: &<a href="#mmr_mmr_Proof">mmr::mmr::Proof</a>, data: vector&lt;u8&gt;): bool
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_verify">verify</a>(proof: &<a href="#mmr_mmr_Proof">Proof</a>, data: vector&lt;u8&gt;): bool {
    // For verifying the data we need to calculate the hash <b>for</b> the proof position tree's peak
    // and combine it with the rest of peak hashes and <a href="#mmr_mmr_MMR">MMR</a> size to calculate the root hash
    <b>let</b> <b>mut</b> peaks_hashes= vector::empty&lt;vector&lt;u8&gt;&gt;();
    <b>let</b> calculated_root_hash: vector&lt;u8&gt;;
    // Calculate the path to follow <b>for</b> verification
    <b>let</b> merge_path = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_calc_proof_tree_path_positions">mmr_utils::calc_proof_tree_path_positions</a>(proof.position, proof.mmr_size);
    // Hash the data with the proof position to get the initial hash
    <b>let</b> <b>mut</b> node_hash = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_hash_with_integer">mmr_utils::hash_with_integer</a>(proof.position, vector::singleton(data));
    // Iterate over the merge path positions to get the tree's peak hash
    <b>let</b> <b>mut</b> parent_position: u64;
    <b>let</b> <b>mut</b> child_hashes = vector::empty&lt;vector&lt;u8&gt;&gt;();
    <b>let</b> <b>mut</b> merged_nodes: u64 = 0;
    <b>let</b> <b>mut</b> i = 0;
    <b>while</b> (i &lt; merge_path.length()) {
        <b>if</b> (!<a href="../mmr/mmr_utils.md#mmr_mmr_utils_is_right_sibling">mmr_utils::is_right_sibling</a>(merge_path[i])) {
            child_hashes.push_back(proof.local_tree_path_hashes[merged_nodes]);
            child_hashes.push_back(node_hash);
        } <b>else</b> {
            child_hashes.push_back(node_hash);
            child_hashes.push_back(proof.local_tree_path_hashes[merged_nodes]);
        };
        parent_position = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_get_parent_position">mmr_utils::get_parent_position</a>(merge_path[i]);
        // The nodeHash on the last iteration will be the tree's peak hash
        node_hash = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_hash_with_integer">mmr_utils::hash_with_integer</a>(parent_position, child_hashes);
        merged_nodes = merged_nodes + 1;
        child_hashes = vector::empty&lt;vector&lt;u8&gt;&gt;();
        i = i + 1;
    };
    // Collect all peak hashes <b>for</b> final root verification
    peaks_hashes.append(proof.left_peaks_hashes);
    peaks_hashes.push_back(node_hash);
    peaks_hashes.append(proof.right_peaks_hashes);
    // Combine all peak hashes with the <a href="#mmr_mmr_MMR">MMR</a> size to calculate the root
    calculated_root_hash = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_hash_with_integer">mmr_utils::hash_with_integer</a>(proof.<a href="#mmr_mmr_get_mmr_size">get_mmr_size</a>(), peaks_hashes);
    // Check <b>if</b> it matches the root stored on the proof
    calculated_root_hash == proof.mmr_root
}
</code></pre>



</details>

<a name="mmr_mmr_new"></a>

## Function `new`

Initialize a new MMR object.


<pre><code><b>fun</b> <a href="#mmr_mmr_new">new</a>(ctx: &<b>mut</b> <a href="../dependencies/sui/tx_context.md#sui_tx_context_TxContext">sui::tx_context::TxContext</a>): <a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>fun</b> <a href="#mmr_mmr_new">new</a>(ctx: &<b>mut</b> TxContext): <a href="#mmr_mmr_MMR">MMR</a> {
    <a href="#mmr_mmr_MMR">MMR</a> {
        id: object::new(ctx),
        root: hash::blake2b256((0 <b>as</b> u64).to_string().as_bytes()),
        peaks_hashes: vector::empty&lt;vector&lt;u8&gt;&gt;(),
        nodes_hashes: vector::empty&lt;vector&lt;u8&gt;&gt;()
    }
}
</code></pre>



</details>

<a name="mmr_mmr_create_mmr"></a>

## Function `create_mmr`

Create a new private MMR object and transfer it to the caller address.


<pre><code><b>public</b> <b>entry</b> <b>fun</b> <a href="#mmr_mmr_create_mmr">create_mmr</a>(ctx: &<b>mut</b> <a href="../dependencies/sui/tx_context.md#sui_tx_context_TxContext">sui::tx_context::TxContext</a>)
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>entry</b> <b>fun</b> <a href="#mmr_mmr_create_mmr">create_mmr</a>(ctx: &<b>mut</b> TxContext) {
    transfer::transfer(<a href="#mmr_mmr_new">new</a>(ctx), ctx.sender());
}
</code></pre>



</details>

<a name="mmr_mmr_create_public_mmr"></a>

## Function `create_public_mmr`

Create a new shared MMR that anyone that knows its ID can append elements to it and generate proofs from it.
EXPERIMENTAL: Literally anyone on chain could write to this MMR, so what would be the point?
TO-DO: Explore a capability based version of the MMR that allows to share it while restricting who could write to it.


<pre><code><b>public</b> <b>entry</b> <b>fun</b> <a href="#mmr_mmr_create_public_mmr">create_public_mmr</a>(ctx: &<b>mut</b> <a href="../dependencies/sui/tx_context.md#sui_tx_context_TxContext">sui::tx_context::TxContext</a>)
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>entry</b> <b>fun</b> <a href="#mmr_mmr_create_public_mmr">create_public_mmr</a>(ctx: &<b>mut</b> TxContext) {
    <b>let</b> <a href="#mmr_mmr">mmr</a> = <a href="#mmr_mmr_new">new</a>(ctx);
    <b>let</b> id = object::id(&<a href="#mmr_mmr">mmr</a>);
    transfer::share_object(<a href="#mmr_mmr">mmr</a>);
    event::emit(<a href="#mmr_mmr_MMRShared">MMRShared</a> {
        creator: ctx.sender(),
        id: id
    });
}
</code></pre>



</details>

<a name="mmr_mmr_get_root"></a>

## Function `get_root`

Get the current root commitment of the MMR.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_root">get_root</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>): vector&lt;u8&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_root">get_root</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">MMR</a>): vector&lt;u8&gt; {
    <a href="#mmr_mmr">mmr</a>.root
}
</code></pre>



</details>

<a name="mmr_mmr_get_peaks"></a>

## Function `get_peaks`

Get the current peaks of the MMR.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_peaks">get_peaks</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>): vector&lt;vector&lt;u8&gt;&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_peaks">get_peaks</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">MMR</a>): vector&lt;vector&lt;u8&gt;&gt; {
    <a href="#mmr_mmr">mmr</a>.peaks_hashes
}
</code></pre>



</details>

<a name="mmr_mmr_get_nodes"></a>

## Function `get_nodes`

Get all nodes in the MMR.


<pre><code><b>public</b>(package) <b>fun</b> <a href="#mmr_mmr_get_nodes">get_nodes</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>): vector&lt;vector&lt;u8&gt;&gt;
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b>(package) <b>fun</b> <a href="#mmr_mmr_get_nodes">get_nodes</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">MMR</a>): vector&lt;vector&lt;u8&gt;&gt; {
    <a href="#mmr_mmr">mmr</a>.nodes_hashes
}
</code></pre>



</details>

<a name="mmr_mmr_get_size"></a>

## Function `get_size`

Get the amount of nodes in the MMR.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_size">get_size</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>): u64
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_get_size">get_size</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">MMR</a>): u64 {
    <a href="#mmr_mmr">mmr</a>.nodes_hashes.length()
}
</code></pre>



</details>

<a name="mmr_mmr_append_leaves"></a>

## Function `append_leaves`

Append multiple leaf elements to the MMR.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_append_leaves">append_leaves</a>(<a href="#mmr_mmr">mmr</a>: &<b>mut</b> <a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>, leaves_data: vector&lt;vector&lt;u8&gt;&gt;)
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_append_leaves">append_leaves</a>(<a href="#mmr_mmr">mmr</a>: &<b>mut</b> <a href="#mmr_mmr_MMR">MMR</a>, leaves_data: vector&lt;vector&lt;u8&gt;&gt;) {
    <b>if</b> (leaves_data.length() == 0) {
        <b>return</b>
    };
    <b>let</b> <b>mut</b> i = 0;
    <b>while</b> (i &lt; leaves_data.length()) {
        <a href="#mmr_mmr_append_leaf">append_leaf</a>(<a href="#mmr_mmr">mmr</a>, leaves_data[i]);
        i = i + 1;
    };
    event::emit(<a href="#mmr_mmr_MMRUpdated">MMRUpdated</a> {
        root: <a href="#mmr_mmr">mmr</a>.root,
        peaks: <a href="#mmr_mmr">mmr</a>.peaks_hashes,
        new_size: <a href="#mmr_mmr">mmr</a>.<a href="#mmr_mmr_get_size">get_size</a>()
    })
}
</code></pre>



</details>

<a name="mmr_mmr_append_leaf"></a>

## Function `append_leaf`

Append a single leaf element to the MMR.
This is the core append logic that handles the creation of new nodes and merging of peaks as needed.


<pre><code><b>fun</b> <a href="#mmr_mmr_append_leaf">append_leaf</a>(<a href="#mmr_mmr">mmr</a>: &<b>mut</b> <a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>, leaf_data: vector&lt;u8&gt;)
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>fun</b> <a href="#mmr_mmr_append_leaf">append_leaf</a>(<a href="#mmr_mmr">mmr</a>: &<b>mut</b> <a href="#mmr_mmr_MMR">MMR</a>, leaf_data: vector&lt;u8&gt;) {
    // Calculate which <a href="#mmr_mmr_new">new</a> nodes and peaks will be created by appending a <a href="#mmr_mmr_new">new</a> leaf
    <b>let</b> <b>mut</b> child_hashes: vector&lt;vector&lt;u8&gt;&gt;;
    <b>let</b> peaks_positions: vector&lt;u64&gt;;
    // The <a href="#mmr_mmr_new">new</a> leaf will take the next node position
    <b>let</b> <b>mut</b> node_position = <a href="#mmr_mmr">mmr</a>.<a href="#mmr_mmr_get_size">get_size</a>() + 1;
    // Hash the leaf data with the position and store it on the list of <a href="#mmr_mmr_new">new</a> nodes
    <b>let</b> <b>mut</b> node_hash = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_hash_with_integer">mmr_utils::hash_with_integer</a>(node_position, vector::singleton(leaf_data));
    <b>let</b> <b>mut</b> new_nodes_hashes = vector::singleton(node_hash);
    // If it is a right sibling, it will generate a <a href="#mmr_mmr_new">new</a> parent node. As long <b>as</b> the newly
    // generated parent nodes remain right siblings, they will <b>continue</b> generating <a href="#mmr_mmr_new">new</a> parents
    <b>while</b> (<a href="../mmr/mmr_utils.md#mmr_mmr_utils_is_right_sibling">mmr_utils::is_right_sibling</a>(node_position)) {
        // Get the left sibling hash using the node position and combine it with the node hash
        child_hashes = vector::singleton(<a href="#mmr_mmr">mmr</a>.nodes_hashes[<a href="../mmr/mmr_utils.md#mmr_mmr_utils_get_sibling_position">mmr_utils::get_sibling_position</a>((node_position)) - 1]);
        child_hashes.push_back(node_hash);
        // Hash the siblings with the position the parent will take to create the parent node
        node_position = node_position + 1;
        node_hash = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_hash_with_integer">mmr_utils::hash_with_integer</a>(node_position, child_hashes);
        // And finally add it to the list of <a href="#mmr_mmr_new">new</a> nodes generated by the leaf appending
        new_nodes_hashes.push_back(node_hash);
    };
    // Save the <a href="#mmr_mmr_new">new</a> nodeHashes to the <a href="#mmr_mmr_MMR">MMR</a> state
    <a href="#mmr_mmr">mmr</a>.nodes_hashes.append(new_nodes_hashes);
    // Get the <a href="#mmr_mmr_new">new</a> peak positions
    peaks_positions = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_get_peaks_positions">mmr_utils::get_peaks_positions</a>(<a href="#mmr_mmr">mmr</a>.<a href="#mmr_mmr_get_size">get_size</a>());
    // Update the peak hashes on the <a href="#mmr_mmr_MMR">MMR</a> state
    <a href="#mmr_mmr">mmr</a>.peaks_hashes = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_get_hashes_from_positions">mmr_utils::get_hashes_from_positions</a>(<a href="#mmr_mmr">mmr</a>.nodes_hashes, peaks_positions);
    // Finally update the <a href="#mmr_mmr_MMR">MMR</a> root bagging all the <a href="#mmr_mmr_new">new</a> peaks along the <a href="#mmr_mmr_new">new</a> <a href="#mmr_mmr_MMR">MMR</a> size
    <a href="#mmr_mmr">mmr</a>.root = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_hash_with_integer">mmr_utils::hash_with_integer</a>(<a href="#mmr_mmr">mmr</a>.<a href="#mmr_mmr_get_size">get_size</a>(), <a href="#mmr_mmr">mmr</a>.peaks_hashes);
}
</code></pre>



</details>

<a name="mmr_mmr_generate_proof"></a>

## Function `generate_proof`

Generate a proof for the element at the specified position.


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_generate_proof">generate_proof</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">mmr::mmr::MMR</a>, position: u64): <a href="#mmr_mmr_Proof">mmr::mmr::Proof</a>
</code></pre>



<details>
<summary>Implementation</summary>


<pre><code><b>public</b> <b>fun</b> <a href="#mmr_mmr_generate_proof">generate_proof</a>(<a href="#mmr_mmr">mmr</a>: &<a href="#mmr_mmr_MMR">MMR</a>, position: u64): <a href="#mmr_mmr_Proof">Proof</a> {
    // Check that the position that wants to get proved is correct
    <b>assert</b>!(position &gt; 0, <a href="#mmr_mmr_EStartsAtOne">EStartsAtOne</a>);
    <b>assert</b>!(<a href="../mmr/mmr_utils.md#mmr_mmr_utils_get_height">mmr_utils::get_height</a>(position) == 1, <a href="#mmr_mmr_EProofOnlyLeaf">EProofOnlyLeaf</a>);
    <b>let</b> size = <a href="#mmr_mmr">mmr</a>.<a href="#mmr_mmr_get_size">get_size</a>();
    <b>assert</b>!(position &lt;= size, <a href="#mmr_mmr_ENonExistingNode">ENonExistingNode</a>);
    // Calculate the positions of all nodes needed <b>for</b> the proof
    <b>let</b> proof_positions = <a href="../mmr/mmr_utils.md#mmr_mmr_utils_calc_proof_positions">mmr_utils::calc_proof_positions</a>(position, size);
    // Create proof from the calculated positions and their corresponding hashes
    <a href="#mmr_mmr_Proof">Proof</a> {
        position: position,
        local_tree_path_hashes: proof_positions.get_local_tree_path_hashes(<a href="#mmr_mmr">mmr</a>.nodes_hashes),
        left_peaks_hashes: proof_positions.get_left_peaks_hashes(<a href="#mmr_mmr">mmr</a>.nodes_hashes),
        right_peaks_hashes: proof_positions.get_right_peaks_hashes(<a href="#mmr_mmr">mmr</a>.nodes_hashes),
        mmr_root: <a href="#mmr_mmr">mmr</a>.root,
        mmr_size: size
    }
}
</code></pre>



</details>
